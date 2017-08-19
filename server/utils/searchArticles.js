/**
*
* searchArticles.js
*
* This module queries the articles databases (located at /Voumes/WIKI-DRIVE/
* articles/) and the adjacency databases (located at /Volumes/WIKI-DRIVE/
* adj/) and uses breadth first search (BFS) to traverse from the starting
* article to its outgoing articles.
*
* As the algorithm is traversing this graph of articles, they are filtered by
* comparing their DocumentVector cosine distances to the given text
* similarity threshold. Articles that are below the threshold are dropped and
* their adjacency lists are not further considered in the graph traversal.
*
* Since we need to use a Queue (synchronously) for BFS, we use the sqlite-sync
* module to make synchronous requests to the database.
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

  // For debug purposes:
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

  // For debug purposes:
  // console.log(dvStartingArticle);

  // Initialize visited and queue to contain starting article:
  visited.add(startingArticle);
  queue.push(startingArticle);

  // Start BFS:
  while (queue && queue.length > 0) {
    current = queue.shift();
    console.log(current);
  }
};

module.exports = {
  searchArticles
};
