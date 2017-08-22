/**
*
* isEmpty.js
*
* Returns true is Object is empty (has no properties), otherwise false.
*
**/

const isEmpty = (obj) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

module.exports = {
  isEmpty
};
