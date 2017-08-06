const natural = require('natural');
const {Article} = require('./../models/article');
const {ArticleAdjacencyList} = require('./../models/articleAdjacencyList');
const DocumentVector = require('./documentVector');
const {normalizePercentage} = require('./normalizePercentage');
const {normalizeDocumentText} = require('./normalizeDocumentText');
const tokenizer = new natural.WordTokenizer();

const findArticlesUnlimited = (article, textSimilarity) => {

  var visited =   {};
  var processed = [];
  var queue =     [];
  var startTitle = article.articleTitle;
  var articleText = tokenizer.tokenize(normalizeDocumentText(article));
  var articleDv = new DocumentVector(articleText);

  // Starting breadth first search:
  visited[startTitle] = 1;
  queue.push(startTitle);
  processed.push(article);

  while (queue.length > 0) {
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
          console.log(articleAdj);

          return new Promise((resolve, reject) => {

            if (!articleAdj || articleAdj.articleAdjacencyList.length === 0) {
              reject();
            }

            currentArticleAdj = articleAdj.articleAdjacencyList;
            resolve(articleAdj.articleAdjacencyList);
          });
      })
      .catch((error) => {
        console.log('Error: an error occurred 1.');
        console.log(error);
      });
    })
    // Given the adjacencyList, an array of strings that represent
    // outgoing links from the original article, is filtered by whether they
    // have already been visited.
    .then((adjacencyList) => {
      console.log(adjacencyList);

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

      // console.log(JSON.stringify(results, undefined, 2));

      results.forEach((x) => {
        const xtext = tokenizer.tokenize(normalizeDocumentText(x));
        const xdv = new DocumentVector(xtext);
        const cosineDistance = articleDv.cosineDistanceTo(xdv);

        if (DocumentVector.mapRange(cosineDistance) >=
          normalizePercentage(textSimilarity)) {
            processed.push(x);
            queue.push(x);
        }
      });
    })
    .catch((error) => {
      console.log('Error: an error occurred 2.');
      console.log(error);
    });
  }

  // return processed;
};

module.exports = {
  findArticlesUnlimited
};
