const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const lowerCaseQuery = require("../utils/lowerCaseQuery");
const Entry = require("./../models/ledgerEntriesModel");
const factoryController = require("./factoryController");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Not an image! Please upload only images"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.resizeDocument = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  req.body.photo = await Promise.all(
    req.files.map(async file => {
      const filename = `doc-${req.body.customer}-${Date.now()}.jpeg`;

      await sharp(file.buffer)
        .resize({
          width: 800,
          height: 1000,
          fit: "fill",
          rotate: false
        })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/documents/${filename}`);

      return filename;
    })
  );

  next();
};

exports.uploadDocumentPhoto = upload.array("documents", 30);

exports.addDocuments = async (req, res, next) => {
  try {
    const entryToUpdate = await Entry.findById(req.params.entryId);
    req.body.photo.forEach(photo => {
      entryToUpdate.photo.push(photo);
    });

    await entryToUpdate.save();

    res.status(200).json({
      status: "success"
    });
  } catch (err) {
    console.log("Error from entryToUpdate function", err);
  }
};

exports.createEntry = async (req, res, next) => {
  try {
    const entry = await Entry.create(req.body);

    res.status(200).json({
      status: "success",
      data: entry
    });
  } catch (err) {
    console.log("Error from createEntry CreateOne", err);
  }
};

exports.getAllEntries = async (req, res, next) => {
  const queryObj = lowerCaseQuery(req.query);

  // A) Filtering
  const query = Entry.find(queryObj);

  // B) Sorting and Limiting fields
  new ApiFeatures(query, req.query).sort("particulars").fields();

  // EXECUTING QUERY
  const documents = await query;

  res.status(200).json({
    status: "success",
    data: documents
  });
};

exports.updateEntry = async (req, res, next) => {
  // changing both debit and credit balance's format to INR
  if (req.body.debitBalance) {
    req.body.debitBalance = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR"
    })
      .format(req.body.debitBalance)
      .split(".")[0];

    if (req.body.debitBalance === "₹0") req.body.debitBalance = undefined;
  }

  if (req.body.creditBalance) {
    req.body.creditBalance = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR"
    })
      .format(req.body.creditBalance)
      .split(".")[0];

    if (req.body.creditBalance === "₹0") req.body.creditBalance = undefined;
  }

  // If user wants the particulars to be empty, then just write "0" inside it
  if (req.body.particulars) {
    if (req.body.particulars === "0") req.body.particulars = "";
  }

  const entry = await Entry.findByIdAndUpdate(req.params.id, req.body);

  if (!entry) return next(new AppError(404, `No Entry found with this ID`));

  res.status(200).json({
    status: "success",
    updatedEntry: entry
  });
};

exports.deleteEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return next(new AppError(404, `No Entry found with this ID`));

    if (entry.photo) {
      entry.photo.forEach(photo => {
        fs.unlink(`public/img/documents/${photo}`, err => {
          if (err) return next(500, "Internal server error");
        });
      });
    }

    await Entry.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success"
    });
  } catch (err) {
    console.log("Error from delete One factoryController", err);
  }
};

exports.getEntry = factoryController.getOne(Entry, "entry");
