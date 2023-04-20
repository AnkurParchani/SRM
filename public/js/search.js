/* eslint-disable */
import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.headers.common["Authorization"] = `Bearer ${Cookies.get("jwt")}`;

export const customerSearch = async (name, area, phoneNumber, firmName) => {
  // Building the URL
  let url = `/customers?`;
  if (name) {
    url += `name=${name}&`;
  }
  if (area) {
    url += `area=${area}&`;
  }
  if (phoneNumber) {
    url += `phoneNumber=${phoneNumber}&`;
  }
  if (firmName) {
    url += `firmName=${firmName}&`;
  }

  // If there's a '&' at the end of the url then replace it
  url = url.replace(/&$/, "");

  location.assign(url);
};

export const ledgerSearch = async (
  particulars,
  date,
  debitAmount,
  creditAmount
) => {
  const currentCustomerId = window.location.pathname.split("/")[2];

  let url = `/customers/${currentCustomerId}?`;

  if (particulars) url += `particulars=${particulars.toLowerCase()}&`;
  if (date) url += `searchDate=${date}&`;
  if (debitAmount) url += `debitBalance=${debitAmount}&`;
  if (creditAmount) url += `creditBalance=${creditAmount}&`;

  //   // If there's a '&' at the end of the url then replace it
  url = url.replace(/&$/, "");

  // Will have to see this tomorrow
  Cookies.set("jwt", currentCookie, { path: `${url}` });
  const currentCookie = Cookies.get("jwt");

  location.assign(url);
};
