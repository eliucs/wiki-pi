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

const codes = require('./codes');
const { convertToDocumentVector } = require('./convertToDocumentVector');
const DocumentVector = require('./documentVector');
const { isEmpty } = require('./isEmpty');

const INDEX_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/index/index.db');
const ARTICLE_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/articles');
const ADJ_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/adj');

const searchArticles = (startingArticle, textSimilarity, callback) => {
  // For debug purposes:
  console.log(startingArticle, textSimilarity);

  if (!startingArticle) {
    console.log('Error: searched with null startingArticle.');
    return callback(codes.ERROR_NULL_STARTING_ARTICLE, undefined);
  }

  // Get starting article index data:
  sqlite.connect(INDEX_LOCATION);
  let startingArticleIndex = sqlite.run(`SELECT title, location
                                        FROM index_table
                                        WHERE title = "${startingArticle}"
                                        LIMIT 1;`)[0];
  sqlite.close();

  if (!startingArticleIndex || isEmpty(startingArticleIndex)) {
    console.log('Error: problem retrieving starting article index.');
    return callback(codes.ERROR_RETRIEVING_STARTING_ARTICLE_INDEX, undefined);
  }

  // For debug purposes:
  // console.log(startingArticleIndex);
  console.log(`${ARTICLE_LOCATION}/${startingArticleIndex.location}.db`);

  sqlite.connect(`${ARTICLE_LOCATION}/${startingArticleIndex.location}.db`);
  let startingArticleData = sqlite.run(`SELECT title, content
                                        FROM articles_table
                                        WHERE title = "${startingArticle}"
                                        LIMIT 1;`)[0];
  sqlite.close();

  if (!startingArticleData || isEmpty(startingArticleData)) {
    console.log('Error: problem retrieving starting article data.');
    return callback(codes.ERROR_RETRIEVING_STARTING_ARTICLE_DATA, undefined);
  }

  let visited = new Set(); // Set of string titles
  let results = []; // List of (title, location) pairs, in order of traversal
  let queue = []; // List of (title, location) pairs
  let dvStartingArticle = convertToDocumentVector(startingArticleData);

  // Initialize visited and queue to contain starting article:
  visited.add(startingArticleIndex.title);
  queue.push(startingArticleIndex);
  results.push(startingArticleIndex);

  // Start BFS:
  while (queue && queue.length > 0) {
    current = queue.shift();
    console.log(current);

    break;

    sqlite.connect(`${ADJ_LOCATION}/${current.location}.db`);
    let adjList = sqlite.run(`SELECT adj
                              FROM adj_table
                              WHERE title = "${current.title}"
                              LIMIT 1;`)[0].adj;
    sqlite.close();
    adjList = JSON.parse(adjList);

    adjList.forEach((article) => {

      // Check if article has already been visited, if so, skip article,
      // otherwise add to visited Set:
      if (visited.has(article)) {
        return;
      }

      visited.add(article);

      // Retrive article's location from index database:
      sqlite.connect(INDEX_LOCATION);
      let articleIndex = sqlite.run(`SELECT title, location
                                     FROM index_table
                                     WHERE title = "${article}"
                                     LIMIT 1;`)[0];
      sqlite.close();

      if (!articleIndex) {
        console.log(`Skipped ${article}, error retrieving from index db.`);
        return;
      }

      console.log(articleIndex);

      // Retrieve article's content:
      console.log(`${ARTICLE_LOCATION}/${articleIndex.location}.db`);
      sqlite.connect(`${ARTICLE_LOCATION}/${articleIndex.location}.db`);
      let articleData = sqlite.run(`SELECT title, content
                                    FROM articles_table
                                    WHERE title = "${articleIndex.title}"
                                    LIMIT 1;`)[0];
      sqlite.close();

      if (!articleData) {
        console.log(`Skipped ${article}, error retrieving from article db.`);
        return;
      }

      // Build DocumentVector from articleData, and compare DocumentVector
      // cosineDistance to the starting article, if within the text similarity
      // threshold then add this article to the results and queue, otherwise,
      // skip article:
      let dvArticleData = convertToDocumentVector(articleData);
      let distance = DocumentVector.mapRange(
        dvStartingArticle.cosineDistanceTo(dvArticleData));

      if (distance >= textSimilarity) {
        console.log(`  Added: ${distance}`);
        results.push(articleIndex);
        queue.push(articleIndex);
      } else {
        console.log(`Ignored: ${distance}`);
      }
    });
  }

  return callback(undefined, results);
};

module.exports = {
  searchArticles
};
