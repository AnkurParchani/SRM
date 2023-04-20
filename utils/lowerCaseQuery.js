/* eslint-disable */

module.exports = queryString => {
  const queryObj = { ...queryString };

  const excludedFields = ["sort", "fields"];
  excludedFields.forEach(el => delete queryObj[el]);

  for (key in queryObj) {
    queryObj[key] = queryObj[key].toLowerCase();
  }
  return queryObj;
};
