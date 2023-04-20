const mongoose = require("mongoose");
const slugify = require("slugify");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A customer must have a name"]
    },
    phoneNumber: String,
    area: {
      type: String,
      required: [true, "A place must be defined for a particular customer"]
    },
    date: {
      type: Date,
      default: Date.now()
    },
    firmName: String,
    slug: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

customerSchema.pre("save", function() {
  this.name = this.name.toLowerCase();
  this.area = this.area.toLowerCase();
  this.firmName = this.firmName.toLowerCase();
  this.slug = slugify(this.name, { lower: true });
});

customerSchema.virtual("entries", {
  ref: "Entry",
  foreignField: "customer",
  localField: "_id"
});

const Customer = mongoose.model("Customers", customerSchema);

module.exports = Customer;
