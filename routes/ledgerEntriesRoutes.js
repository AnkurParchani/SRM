const express = require("express");

const ledgerEntriesController = require("./../controllers/ledgerEntriesController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(ledgerEntriesController.getAllEntries)
  .post(
    ledgerEntriesController.uploadDocumentPhoto,
    ledgerEntriesController.resizeDocument,
    ledgerEntriesController.createEntry
  );

router
  .route("/:id")
  .get(ledgerEntriesController.getEntry)
  .delete(ledgerEntriesController.deleteEntry)
  .patch(
    ledgerEntriesController.uploadDocumentPhoto,
    ledgerEntriesController.resizeDocument,
    ledgerEntriesController.updateEntry
  );

router
  .route("/:entryId/addDocs")
  .post(
    ledgerEntriesController.uploadDocumentPhoto,
    ledgerEntriesController.resizeDocument,
    ledgerEntriesController.addDocuments
  );

module.exports = router;
