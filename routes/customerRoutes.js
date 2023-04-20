const express = require("express");
const customerController = require("./../controllers/customerController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(customerController.getAllCustomers)
  .post(authController.checkAlreadyCustomer, customerController.createCustomer);

router
  .route("/:id")
  .get(customerController.getCustomer)
  .patch(authController.checkAlreadyCustomer, customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

module.exports = router;
