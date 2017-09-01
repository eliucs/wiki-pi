/**
*
* stopWords.js
*
* This module uses the natural.js library and returns Tries containing stop
* words, and functions for checking if a word is a stop word. Currently, only
* English is supported.
*
**/

const stopWordsEn = require('./../../content/stopwords/en.json');

const isStopWord = (word) => {
  return !!stopWordsEn[word];
};

module.exports = {
  isStopWord
};
