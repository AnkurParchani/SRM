const express = require("express");
const viewController = require("./../controllers/viewController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/").get(viewController.loginPage);

router
  .route("/customers")
  .get(authController.protect, viewController.renderAllCustomers);

router
  .route("/customers/:customerId")
  .get(authController.protect, viewController.renderParticularCustomer);

module.exports = router;
