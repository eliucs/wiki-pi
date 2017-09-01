/**
*
* normalizePercentage.js
*
* This module maps percentage from 0-100 to the range 0-1, and returns a 
* Promise. If the percentage is valid, then it resolves the Promise with 
* the correct value between 0-1, otherwise it rejects the Promise and 
* returns an error Object.
*
**/

const normalizePercentage = (percentage, callback) => {
  return new Promise((resolve, reject) => {
    if (isNaN(percentage)) {
      reject({ percentageNotANumber: true });
      return;
    } else if (percentage < 0 || percentage > 100) {
      reject({ percentageIncorrectRange: true });
      return;
    }
    resolve(percentage / 100);
  });
}

module.exports = {
  normalizePercentage
};
