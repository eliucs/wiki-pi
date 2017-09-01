/**
*
* convertToDocumentVector.js
*
* This module takes in the contents of an article document, maps and joins it
* into a string input, tokenizes it using the natural.js library, filters out
* numerical strings and stop words and returns a DocumentVector from the
* tokenized string.
*
**/

const natural = require('natural');
const {isStopWord} = require('./stopWords');
const DocumentVector = require('./documentVector');
const tokenizer = new natural.WordTokenizer();

const convertToDocumentVector = (articleData) => {
  content = JSON.parse(articleData.content);

  // Map and join into string input, and then tokenize into array of string
  // tokens, and filter out numerical tokens and stop words:
  content = tokenizer.tokenize(content
  .map((entry) => {
    return entry.txt;
  })
  .join(' '))
  .filter((token) => {
    return !isNumber(token) &&
           !isStopWord(token) &&
           token.length > 1;
  })
  .map((token) => {
    return token.toLowerCase();
  });

  return new DocumentVector(content);
};

const isNumber = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

module.exports = {
  convertToDocumentVector
};
