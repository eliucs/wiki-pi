/**
 * 
 * isNumber.js
 * 
 * This module checks if the input is a number.
 * 
 */

const isNumber = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

module.exports = {
    isNumber
};
