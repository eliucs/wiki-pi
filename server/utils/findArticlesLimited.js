const natural = require('natural');
const {Article} = require('./../models/article');
const {ArticleAdjacencyList} = require('./../models/articleAdjacencyList');
const DocumentVector = require('./documentVector');
const {normalizePercentage} = require('./normalizePercentage');
const {normalizeDocumentText} = require('./normalizeDocumentText');
const tokenizer = new natural.WordTokenizer();

var visited = {};
var processed = [];
var queue = [];
var textSimilarity;
var articleDv;

const findArticlesLimited = (startingArticle, endingArticle,
                             textSimilarityPercent, callback) => {


  return callback();
};

module.exports = {
  findArticlesLimited
};
