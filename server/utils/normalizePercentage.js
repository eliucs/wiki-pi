/**
*
* normalizePercentage.js
*
* This module maps percentage from 0-100 to the range 0-1.
*
**/

const normalizePercentage = (percentage) => {
  if (isNaN(percentage)) {
    return console.log('Error: percentage is not a number.');
  }

  if (percentage < 0 || percentage > 100) {
    return console.log('Error: percentage is not within range 0 - 100.');
  }

  return percentage / 100;
}

module.exports = {
  normalizePercentage
};
