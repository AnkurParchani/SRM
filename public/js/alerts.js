/* eslint-disable */

const hideAlert = () => {
  const alert = document.querySelector(".alert");
  if (alert) alert.remove();
};

export const showAlert = (type, message, time) => {
  hideAlert();
  const html = `<div class="alert alert--${type}">${message}</div>`;

  document.querySelector("body").insertAdjacentHTML("afterbegin", html);

  setTimeout(() => {
    hideAlert();
  }, time * 1000);
};
