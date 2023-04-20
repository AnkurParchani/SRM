const mongoose = require("mongoose");

const Customer = require("./customerModel");

const ledgerEntriesSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now()
    },
    searchDate: String,
    particulars: String,
    debitBalance: String,
    creditBalance: String,
    photo: [String],
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: Customer
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

ledgerEntriesSchema.pre("save", function(next) {
  // Making search date so that we can find customers according to dates from frontend
  const date = String(this.date.getDate()).padStart(2, "0");
  const month = String(this.date.getMonth() + 1).padStart(2, "0");
  const year = this.date.getFullYear();

  this.searchDate = `${year}-${month}-${date}`;

  // Particulars to lowercase to help in search
  if (this.particulars) this.particulars = this.particulars.toLowerCase();

  // If there is debitBalance then converting it into indian amount
  if (this.debitBalance && !this.debitBalance.startsWith("₹")) {
    this.debitBalance = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR"
    })
      .format(this.debitBalance)
      .split(".")[0];
  }

  // If there is creditBalance then converting it into indian amount
  if (this.creditBalance && !this.creditBalance.startsWith("₹")) {
    this.creditBalance = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR"
    })
      .format(this.creditBalance)
      .split(".")[0];
  }

  next();
});

ledgerEntriesSchema.pre(/^find/, function(next) {
  this.populate({
    path: "customer",
    select: "-__v"
  });
  next();
});

const Entry = mongoose.model("Entry", ledgerEntriesSchema);

module.exports = Entry;
