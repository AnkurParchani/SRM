/* eslint-disable */

import axios from "axios";
import Cookies from "js-cookie";
import { showAlert } from "./alerts";

axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get("jwt")}`;

export const deleteCustomer = async currentCustomerId => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/customers/${currentCustomerId}`
    });

    if (res.data.status === "success") {
      showAlert("success", "Customer Deleted successfully", 2);
      setTimeout(() => {
        location.assign("/customers");
      }, 2000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message, 3);
  }
};

export const deleteEntry = async rowId => {
  try {
    // 1) Doing the request for deleting entry
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/ledgerEntries/${rowId}`
    });

    // 2) If entry is deleted successfully
    if (res.data.status === "success") {
      showAlert("success", "Entry deleted successfully", 1);
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message, 3);
  }
};
