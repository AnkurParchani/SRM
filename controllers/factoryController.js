const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const lowerCaseQuery = require("../utils/lowerCaseQuery");

exports.getAll = (Model, populateField) => {
  return async (req, res, next) => {
    const queryObj = lowerCaseQuery(req.query);

    // A) Filtering
    let query = Model.find(queryObj);

    if (populateField) {
      query = Model.find(queryObj).populate(populateField);
    }

    // B) Sorting and Limiting fields
    new ApiFeatures(query, req.query).sort("particulars").fields();

    // EXECUTING QUERY
    const documents = await query;

    res.status(200).json({
      status: "success",
      result: documents.length,
      data: documents
    });
  };
};

exports.getOne = (Model, documentName, populateField) => {
  return async (req, res, next) => {
    let doc = await Model.findById(req.params.id);

    if (populateField) {
      doc = await Model.findById(req.params.id).populate(populateField);
    }

    if (!doc)
      return next(new AppError(404, `No ${documentName} found with this ID`));

    res.status(200).json({
      status: "success",
      result: doc.length,
      doc
    });
  };
};

exports.createOne = Model => {
  return async (req, res, next) => {
    try {
      if (req.body.phoneNumber) {
        if (req.body.phoneNumber.length > 10)
          return next(new AppError(400, "Phone number must be of 10 digit"));
      }

      if (!req.body.firmName) {
        req.body.firmName = "";
      }

      const doc = await Model.create(req.body);

      res.status(200).json({
        status: "success",
        data: doc
      });
    } catch (err) {
      console.log("Error from factoryController CreateOne", err);
    }
  };
};

exports.updateOne = (Model, documentName) => {
  return async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc)
      return next(new AppError(404, `No ${documentName} found with this ID`));

    doc.set(req.body);
    await doc.save();

    res.status(200).json({
      status: "success",
      updatedEntry: doc
    });
  };
};
