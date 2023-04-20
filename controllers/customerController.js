const fs = require("fs");

const AppError = require("../utils/appError");
const Customer = require("./../models/customerModel");
const Entry = require("./../models/ledgerEntriesModel");
const factoryController = require("./factoryController");

exports.getCustomer = async (req, res, next) => {
  console.log("render particular customer");
  const customer = await Customer.findById(req.params.id).populate("entries");

  const { searchDate, particulars, debitBalance, creditBalance } = req.query;

  if (searchDate) {
    console.log("got date");
    customer.entries = customer.entries.filter(
      entry => entry.searchDate === searchDate
    );
  }

  if (particulars) {
    customer.entries = customer.entries.filter(
      entry => entry.particulars === particulars
    );
  }

  if (debitBalance) {
    customer.entries = customer.entries.filter(
      entry => entry.debitBalance === debitBalance
    );
  }

  if (creditBalance)
    customer.entries = customer.entries.filter(
      entry => entry.creditBalance === creditBalance
    );

  if (!customer)
    return next(new AppError(404, "No Customer found with this request"));

  res.status(200).json({ status: "success", customer });
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const entries = await Entry.find({ customer: req.params.id });

    if (entries.length > 0) {
      entries.forEach(entry => {
        if (entry.photo)
          entry.photo.forEach(photo =>
            fs.unlink(`public/img/documents/${photo}`, err => {
              if (err) return next(500, "Internal server error");
            })
          );
      });
    }

    await Entry.deleteMany({ customer: req.params.id });

    const path = "public/img/documents/";
    const customerId = req.params.id;

    fs.readdirSync(path, { withFileTypes: true }).forEach(file => {
      // check if the file is a file and its name contains the customer id
      if (file.isFile() && file.name.includes(customerId)) {
        // delete the file
        fs.unlinkSync(path + file.name);
      }
    });
    const customer = await Customer.findByIdAndDelete(customerId);

    if (!customer)
      return next(new AppError(404, `No customer found with this ID`));

    res.status(200).json({
      status: "success",
      customer
    });
  } catch (err) {
    console.log("Error from delete customer", err);
  }
};

exports.getAllCustomers = factoryController.getAll(Customer, "entries");
exports.updateCustomer = factoryController.updateOne(Customer, "customer");
exports.createCustomer = factoryController.createOne(Customer);
