/* eslint-disable */

import axios from "axios";
import Cookies from "js-cookie";
import { showAlert } from "./alerts";

axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get("jwt")}`;

export const updateEntry = async (data, entryId) => {
  try {
    // Making the request
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:5000/api/v1/ledgerEntries/${entryId}`,
      data
    });

    // If the request is successful
    if (res.data.status === "success") {
      showAlert("success", "Entry updated", 1.5);
      setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    console.log("Axios updateEntry error", err);
  }
};

export const updateCustomer = async (
  currentCustomerId,
  name,
  area,
  firmName,
  phoneNumber
) => {
  try {
    //   Data to send
    const data = {};
    if (name) data.name = name;
    if (area) data.area = area;
    if (phoneNumber) data.phoneNumber = phoneNumber;
    if (firmName) data.firmName = firmName;

    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:5000/api/v1/customers/${currentCustomerId}`,
      data
    });

    if (res.data.status === "success") {
      showAlert("success", "Customer Updated Successfully", 1.5);
      setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch {
    showAlert("error", err.response.data.message, 3);
  }
};
