/* eslint-disable */

import axios from "axios";
import Cookies from "js-cookie";
import { showAlert } from "./alerts";

axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get("jwt")}`;

export const addCustomer = async (name, area, phoneNumber, firmName) => {
  try {
    const data = { name, area, firmName };
    if (phoneNumber) {
      data.phoneNumber = phoneNumber;
    }

    const res = await axios({
      method: "POST",
      url: "/api/v1/customers",
      data
    });

    if (res.data.status === "success") {
      showAlert("success", "Customer created", 1.5);
      setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message, 3);
  }
};

export const addEntry = async data => {
  try {
    // Getting the current customer's id
    const currentCustomerId = window.location.pathname.split("/")[2];

    // Making the form object to send over axios
    const form = new FormData();
    form.append("customer", currentCustomerId);
    form.append("particulars", data.particulars);
    form.append("date", data.date);
    form.append("debitBalance", data.debitAmount);
    form.append("creditBalance", data.creditAmount);

    // Sending all images of documents
    for (let i = 0; i < data.images.length; i++) {
      form.append("documents", data.images[i]);
    }

    // Sending the request
    const res = await axios({
      method: "POST",
      url: "/api/v1/ledgerEntries",
      data: form,
      withCredentials: true
    });

    // If request was successful
    if (res.data.status === "success") {
      showAlert("success", "Entry created", 1);
      setTimeout(() => {
        location.assign(`/customers/${currentCustomerId}`);
      }, 1000);
    }

    // If there was an error
  } catch (err) {
    showAlert("error", err.response.data.message, 3);
  }
};
