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

const findArticlesUnlimited = (article, textSimilarityPercent, callback) => {
  var startTitle = article.articleTitle;
  var articleText = tokenizer.tokenize(normalizeDocumentText(article));
  articleDv = new DocumentVector(articleText);

  visited[startTitle] = 1;
  queue.push(startTitle);
  processed.push(article);
  textSimilarity = normalizePercentage(textSimilarityPercent);

  findArticles(() => {
    return callback(processed);
  });
};

const findArticles = (callback) => {

  if (queue.length === 0) {
    return callback();
  }

  var currentArticleTitle = queue.shift();
  var currentArticleText;
  var currentArticleDv;
  var currentArticleAdj;

  Article.findOne({
    articleTitle: currentArticleTitle
  })
  // Find Article with this correct title, then tokenize into an array of
  // string tokens, and pass this array into the constructor of a new
  // DocumentVector.
  .then((article) => {

    return new Promise((resolve, reject) => {

      if (!article) {
        reject();
      }

      currentArticleText = tokenizer.tokenize(normalizeDocumentText(article));
      currentArticleDv = new DocumentVector(currentArticleText);

      resolve(article);
    });
  })
  // Find this Article's corresponding ArticleAdjacencyList, update
  // currentArticleAdj to be this array.
  .then((article) => {

    return ArticleAdjacencyList.findOne({
      articleTitle: article.articleTitle
    })
    .then((articleAdj) => {
        return new Promise((resolve, reject) => {

          if (!articleAdj) {
            reject();
          } else {
            currentArticleAdj = articleAdj.articleAdjacencyList;
            resolve(articleAdj.articleAdjacencyList);
          }
        });
    })
    .catch((error) => {
      console.log('Error: an error occurred 1.');
    });
  })
  // Given the adjacencyList, an array of strings that represent
  // outgoing links from the original article, is filtered by whether they
  // have already been visited.
  .then((adjacencyList) => {
    var filtered = [];

    var filtered = adjacencyList.filter((x) => {
      if (!visited.hasOwnProperty(x.articleTitle)) {
        return true;
      }
      return false;
    });

    // Add each filted element in the adjacency list to visited, and add
    // to queue. Make concurrent queries to the database, an Array of
    // Promises is built from querying every element of filtered.
    var jobQueries = [];
    filtered.forEach((x) => {
      const articleTitle = x.articleTitle;
      visited[articleTitle] = 1;

      jobQueries.push(Article.find({
        articleTitle: articleTitle
      }));
    });

    return Promise.all(jobQueries);
  })
  // Given the array of jobQueries, they are processed concurrently and
  // added to the final processed array only if they are within the text
  // similarily threshold.
  .then((results) => {
    results = results.map((x) => {
      return x[0];
    });

    results.forEach((x) => {
      const xtext = tokenizer.tokenize(normalizeDocumentText(x));
      const xdv = new DocumentVector(xtext);
      const cosineDistance = articleDv.cosineDistanceTo(xdv);

      if (DocumentVector.mapRange(cosineDistance) >= textSimilarity) {
          processed.push(x);
          queue.push(x.articleTitle);
      }
    });

    return findArticles(callback);
  })
  .catch((error) => {
    console.log('Error: an error occurred 2.');
    console.log(error);
  });

}

module.exports = {
  findArticlesUnlimited
};
