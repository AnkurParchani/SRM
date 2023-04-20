/* eslint-disable */

import { removeEntriesClasses } from "../../utils/helperFunction";
import { addCustomer, addEntry } from "./add";
import { showAlert } from "./alerts";
import { disableLinks } from "./helperFunctions";
import { deleteCustomer, deleteEntry } from "./delete";
import { login, logout } from "./login";
import { showModal } from "./modal";
import { ledgerSearch, customerSearch } from "./search";
import { updateCustomer, updateEntry } from "./update";
import { addDocuments, showDocuments } from "./documents";

const loginForm = document.querySelector(".login_form");
const logoutBtn = document.querySelector("#logoutBtn");
const noCustomersPage = document.querySelector(".noCustomersPage");
const unauthorizedPage = document.querySelector(".unauthorizedPage");
const customerTableTr = document.querySelectorAll(".customerTable_tr");
const entrySearchForm = document.querySelector(".entrySearchForm");
const customerSearchForm = document.querySelector(".customerSearchForm");
const addCustomerForm = document.querySelector(".customerAddForm");
const addEntryForm = document.querySelector(".addEntryForm");
const entryTableTr = document.querySelectorAll(".entryTable_tr");
const updateCustomerForm = document.querySelector(".updateCustomerForm");
const addDocs = document.querySelector(".addDocs");

// For login
if (loginForm) {
  // Disabling nav links
  disableLinks(["addCustomerLink", "allCustomerLink", "logoutBtn"]);

  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const username = document.querySelector(".login_username").value;
    const password = document.querySelector(".login_password").value;

    login(username, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (noCustomersPage) {
  disableLinks(["allCustomerLink"]);

  document.querySelector("#addCustomerLink").addEventListener("click", () => {
    console.log("clicked on add customer");
    showModal("addCustomer");
  });

  document
    .querySelector(".noCustomersContainer_addCustomer")
    .addEventListener("click", () => {
      console.log("clicked on add customer");
      showModal("addCustomer");
    });
}
if (unauthorizedPage)
  disableLinks(["addCustomerLink", "allCustomerLink", "logoutBtn"]);

if (customerTableTr) {
  // Looping through all rows
  customerTableTr.forEach(row => {
    row.addEventListener("click", e => {
      const selectedCustomerId = row.dataset.id;

      // Locating customer to it's particular page if the click is not of EDIT button
      if (!e.target.closest(".dropdown_td")) {
        return location.assign(`customers/${selectedCustomerId}`);
      }

      // If user selected for deleting customer
      if (e.target.closest(".deleteCustomerBtn")) {
        // Getting all the delete customer's variables
        const deleteCustomerModal = document.querySelector(
          ".deleteCustomer-modal"
        );
        const confirmDelete = document.querySelector(
          ".deleteCustomerModal_deleteBtn"
        );
        const cancelBtn = document.querySelector(
          ".deleteCustomer-modal_closeBtn"
        );
        const modalBackdrop = document.querySelector(".modalBackdrop");

        // Showing the modal
        deleteCustomerModal.classList.remove("hidden");
        modalBackdrop.style.display = "block";

        confirmDelete.addEventListener("click", () => {
          setTimeout(() => {
            deleteCustomerModal.classList.add("hidden");
            modalBackdrop.style.display = "none";
          }, 3000);
          deleteCustomer(selectedCustomerId);
        });
        cancelBtn.addEventListener("click", () => {
          deleteCustomerModal.classList.add("hidden");
          modalBackdrop.style.display = "none";
        });

        // Removing modal backdrop if user clicked on outside window
        modalBackdrop.addEventListener("click", () => {
          modalBackdrop.style.display = "none";
          deleteCustomerModal.classList.add("hidden");
        });
      }

      // If user selected for updating customer
      if (e.target.closest(".updateCustomerBtn")) {
        showModal("updateCustomer");
        updateCustomerForm.addEventListener("submit", e => {
          e.preventDefault();
          const name = document
            .querySelector("#updateCustomer-name")
            .value.trim();
          const area = document
            .querySelector("#updateCustomer-area")
            .value.trim();
          const phoneNumber = document
            .querySelector("#updateCustomer-phoneNumber")
            .value.trim();
          const firmName = document
            .querySelector("#updateCustomer-firmName")
            .value.trim();

          updateCustomer(selectedCustomerId, name, area, firmName, phoneNumber);
        });
      }
    });
  });
}

if (addCustomerForm) {
  // Adding a new customer
  // Showing modal on click
  document.querySelector("#addCustomerLink").addEventListener("click", () => {
    showModal("addCustomer");
  });

  addCustomerForm.addEventListener("submit", e => {
    e.preventDefault();

    // Getting all the data
    const name = document.querySelector("#customerAdd-name").value.trim();
    const area = document.querySelector("#customerAdd-area").value.trim();
    let phoneNumber = document
      .querySelector("#customerAdd-phoneNumber")
      .value.trim();
    let firmName = document.querySelector("#customerAdd-firmName").value.trim();

    // Sending the data to make request
    addCustomer(name, area, phoneNumber, firmName);
  });
}

// For searching customers
if (customerSearchForm) {
  // Redering the form
  document.querySelector("#searchCustomerBtn").addEventListener("click", () => {
    showModal("customerSearch");
  });

  customerSearchForm.addEventListener("submit", e => {
    e.preventDefault();

    // Getting all the data
    const name = String(
      document.querySelector("#customerSearch-name").value
    ).toLowerCase();
    const area = String(
      document.querySelector("#customerSearch-area").value
    ).toLowerCase();
    const phoneNumber = Number(
      document.querySelector("#customerSearch-phoneNumber").value
    );
    const firmName = String(
      document.querySelector("#customerSearch-firmName").value
    );

    customerSearch(name, area, phoneNumber, firmName);
  });
}

// Adding a new entry
if (addEntryForm) {
  // Rendering the form
  document.querySelector(".allEntryAddBtn").addEventListener("click", () => {
    showModal("addEntry");
  });

  // Disabling navbar links
  disableLinks(["addCustomerLink"]);

  addEntryForm.addEventListener("submit", e => {
    e.preventDefault();
    const particulars = document
      .querySelector("#addEntry-particulars")
      .value.trim();
    const date = document.querySelector("#addEntry-date").value;
    const debitAmount = document
      .querySelector("#addEntry-debitAmount")
      .value.trim();
    const creditAmount = document
      .querySelector("#addEntry-creditAmount")
      .value.trim();
    const images = document.querySelector("#addEntry-Image").files;

    if (!isNaN(debitAmount) && !isNaN(creditAmount)) {
      addEntry({ particulars, date, debitAmount, creditAmount, images });
    } else {
      showAlert("error", "Amount can only be a number", 3);
    }
  });
}

if (entrySearchForm) {
  // showing all entries link if the user has searched for something, so that he can go to original all entries page
  if (window.location.search)
    document.querySelector(".allEntriesLink").classList.remove("hidden");

  document.querySelector(".allEntrySearchBtn").addEventListener("click", () => {
    showModal("entrySearch");
  });
  entrySearchForm.addEventListener("submit", e => {
    e.preventDefault();

    // Getting all the data
    const particulars = document.querySelector("#searchEntry-particulars")
      .value;
    const date = document.querySelector("#searchEntry-date").value;
    let debitAmount = document.querySelector("#searchEntry-debitAmount").value;
    let creditAmount = document.querySelector("#searchEntry-creditAmount")
      .value;

    // Converting normal number to INR format to match it from the database
    if (debitAmount) {
      debitAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR"
      })
        .format(debitAmount)
        .split(".")[0];
    }
    if (creditAmount) {
      creditAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR"
      })
        .format(creditAmount)
        .split(".")[0];
    }

    // Sending data to ledgerSearch for further request
    ledgerSearch(particulars, date, debitAmount, creditAmount);
  });
}

if (entryTableTr) {
  entryTableTr.forEach(entry => {
    entry.addEventListener("click", async e => {
      // Removing already present classes on row
      removeEntriesClasses(entryTableTr);

      entry.classList.add("rowClicked");

      // If user selects on cancel
      if (e.target.closest(".cancelBtn")) {
        removeEntriesClasses(entryTableTr);
      }

      // If user selects for delete entry
      if (e.target.closest(".deleteEntryBtn")) {
        entry.classList.add("rowClicked");
        await deleteEntry(entry.dataset.id);
      }

      // If user selects for update entry
      if (e.target.closest(".updateEntryBtn")) {
        showModal("updateEntry");

        const updateEntryForm = document.querySelector(
          ".updateExistingEntryForm"
        );

        updateEntryForm.addEventListener("submit", async e => {
          e.preventDefault();
          // Getting new data
          const particulars = document.querySelector(
            "#updateExistingEntry-particulars"
          );
          const date = document.querySelector("#updateExistingEntry-date");
          const creditAmount = document.querySelector(
            "#updateExistingEntry-creditAmount"
          );
          const debitAmount = document.querySelector(
            "#updateExistingEntry-debitAmount"
          );
          const documents = document.querySelector("#updateDocuments").files;

          if (
            isNaN(Number(debitAmount.value)) ||
            isNaN(Number(creditAmount.value))
          ) {
            return showAlert("error", "Amount can only be a number", 3);
          }

          const data = new FormData();

          const fields = [
            { name: "particulars", value: particulars.value.trim() },
            { name: "date", value: date.value.trim() },
            { name: "debitBalance", value: debitAmount.value.trim() },
            { name: "creditBalance", value: creditAmount.value.trim() }
          ];

          fields.forEach(field => {
            if (field.value) data.append(field.name, field.value);
          });

          if (documents.length > 0) {
            for (let i = 0; i < documents.length; i++) {
              data.append("documents", documents[i]);
            }
          }
          const currentCustomerId = window.location.pathname.split("/")[2];
          data.append("customer", currentCustomerId);

          // Calling updateEntry function with all the data
          await updateEntry(data, entry.dataset.id);

          // Clearing all fields after saving to database
          particulars.value = date.value = debitAmount.value = creditAmount.value =
            "";
          removeEntriesClasses(entryTableTr);
        });
      }

      // If user clicks for to show documents
      if (e.target.closest(".showPagesBtn")) {
        showDocuments(entry.dataset.id);
        removeEntriesClasses(entryTableTr);
      }

      if (e.target.closest(".addPagesBtn")) {
        showModal("addDocs");

        addDocs.addEventListener("submit", e => {
          e.preventDefault();
          const images = document.querySelector("#addDocuments").files;

          addDocuments(images, entry.dataset.id);
        });
      }
    });
  });
  document.addEventListener("click", e => {
    if (!e.target.closest(".entryTable")) removeEntriesClasses(entryTableTr);
  });
}
