const Customer = require("../models/customerModel");
const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const lowerCaseQuery = require("../utils/lowerCaseQuery");

exports.loginPage = (req, res) => {
  res.render("_login");
};

exports.renderAllCustomers = async (req, res) => {
  const queryObj = lowerCaseQuery(req.query);
  // A) Filtering
  const query = Customer.find(queryObj);

  // B) Sorting and Limiting fields
  new ApiFeatures(query, req.query).sort("name").fields();

  // EXECUTING QUERY
  const customers = await query;

  if (customers.length < 1) return res.render("noCustomers");

  res.render("_allCustomers", { customers });
};

exports.renderParticularCustomer = async (req, res, next) => {
  // Getting the customer as per slug
  const customer = await Customer.findById(req.params.customerId).populate(
    "entries"
  );

  // Checking if the customer exists
  if (!customer)
    return next(new AppError(404, "No customer found with this name"));

  const { searchDate, particulars, debitBalance, creditBalance } = req.query;

  if (searchDate) {
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

  // Sorting the entries of the customer in descending order so that the one with recent date appear in above
  customer.entries = customer.entries.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Making variables for debit and credit balance
  let totalDebitBalance = 0;
  let totalCreditBalance = 0;

  // Looping through array to get total debit/creditBalance
  customer.entries.forEach(entry => {
    if (entry.debitBalance) {
      const debitAmount = Number(
        String(entry.debitBalance).replace(/₹|,/g, "")
      );
      totalDebitBalance += debitAmount;
    }

    if (entry.creditBalance) {
      const creditAmount = Number(
        String(entry.creditBalance).replace(/₹|,/g, "")
      );
      totalCreditBalance += creditAmount;
    }
  });

  const totalBalance = totalDebitBalance - totalCreditBalance;

  res.render("_customer", { customer, totalBalance });
};
