/* eslint-disable */

export const removeEntriesClasses = Array => {
  Array.forEach(row => {
    row.classList.remove("rowClicked");
  });
};
