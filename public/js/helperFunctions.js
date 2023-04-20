/* eslint-disable */

export const disableLinks = links => {
  links.forEach(link => {
    document.querySelector(`#${link}`).classList.add("disabled");
  });
};
export const enableLinks = links => {
  links.forEach(link => {
    document.querySelector(`#${link}`).classList.remove("disabled");
  });
};
