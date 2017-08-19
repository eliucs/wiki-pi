/**
*
* searchArticles.js
*
* This module queries the articles databases (located at /Voumes/WIKI-DRIVE/
* articles/) and the adjacency databases (located at /Volumes/WIKI-DRIVE/
* adj/) and uses breadth first search to traverse from the starting article
* to its outgoing articles.
*
* As the algorithm is traversing this graph of articles, they are filtered by
* comparing their DocumentVector cosine distances to the given text
* similarity threshold. Articles that are below the threshold are dropped and
* its adjacency list is not further considered in the graph traversal.
*
* Since we need to use a Queue (synchronously) for breadth first search, we
* use the sqlite-sync module to make synchronous requests to the databases.
*
**/

const path = require('path');
const sqlite = require('sqlite-sync');

const {convertToDocumentVector} = require('./convertToDocumentVector');

const INDEX_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/index/index.db');
const ARTICLE_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/articles');
const ADJ_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/adj');

const searchArticles = (startingArticle, textSimilarity, callback) => {
  console.log(startingArticle, textSimilarity);

  if (!startingArticle) {
    console.log('Error: searched with null startingArticle.');
    return callback(undefined, undefined, undefined);
  }

  // Get starting article data:
  sqlite.connect(INDEX_LOCATION);
  let startingArticleIndex = sqlite.run(`SELECT title, location
                                        FROM index_table
                                        WHERE title = "${startingArticle}"
                                        LIMIT 1;`)[0];
  sqlite.close();
  console.log(startingArticleIndex);
  console.log(`${ARTICLE_LOCATION}/${startingArticleIndex.location}.db`);
  sqlite.connect(`${ARTICLE_LOCATION}/${startingArticleIndex.location}.db`);
  let startingArticleData = sqlite.run(`SELECT title, content
                                        FROM articles_table
                                        WHERE title = "${startingArticle}"
                                        LIMIT 1;`)[0];

  let visited = new Set();
  let results = [];
  let queue = [];
  let dvStartingArticle = convertToDocumentVector(startingArticleData);
  visited.add(startingArticle);


  console.log(dvStartingArticle);
};

module.exports = {
  searchArticles
};
