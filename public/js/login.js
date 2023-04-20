/* eslint-disable */
import axios from "axios";
import Cookies from "js-cookie";

import { showAlert } from "./alerts";

export const login = async (username, password) => {
  try {
    const res = await axios(
      {
        method: "POST",
        url: "http://127.0.0.1:5000/api/v1/admin/login",
        data: { username, password }
      },
      { withCredentials: true }
    );

    if (res.data.status === "success") {
      const expirationTime = new Date(Date.now() + 1000 * 60 * 30);
      Cookies.set("jwt", res.data.token, {
        expires: expirationTime,
        path: "/"
      });

      showAlert("success", "Logged in! welcome", 1.5);

      setTimeout(() => {
        location.assign("/customers");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message, 2);
  }
};

export const logout = () => {
  if (Cookies.get("jwt")) Cookies.remove("jwt");

  showAlert("success", "Logged out successfully", 2);
  setTimeout(() => {
    location.assign("/");
  }, 2000);
};
