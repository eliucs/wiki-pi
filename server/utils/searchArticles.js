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
**/

const path = require('path');
const sqlite = require('sqlite3').verbose();

const INDEX_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/index/index.db');
const ARTICLES_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/articles');
const ADJ_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/adj');

const searchArticles = (startingArticle, textSimilarity, callback) => {
  console.log(startingArticle, textSimilarity);

  const dbIndex = new sqlite.Database(INDEX_LOCATION);
  let dbArticles;
  let dbAdj;

  if (!startingArticle) {
    console.log('Error: searched with null startingArticle.');
    return callback(undefined, undefined, [dbIndex, dbArticles, dbAdj]);
  }

  dbIndex.serialize(() => {
    const query = `SELECT title, location
                   FROM index_table
                   WHERE title = "${startingArticle}"
                   LIMIT 1;`;

    dbIndex.all(query, (err, results) => {
      // Check if there was a database error:
      if (err) {
        console.log('Error: retrieving search results after quering index.db.');
        // return callback(true, undefined, [dbIndex, dbArticles, dbAdj]);
      }

      results = results[0];

      let location = '/' + results.location + '.db';

      console.log(results);
      console.log(ARTICLES_LOCATION + location);

      dbArticles = new sqlite.Database(ARTICLES_LOCATION + location);

      dbArticles.serialize(() => {
        const query = `SELECT title, content
                       FROM articles_table
                       WHERE title = "${startingArticle}"
                       LIMIT 1;`;

        dbArticles.all(query, (err, results) => {
          // Check if there was a database error:
          if (err) {
            console.log('Error: retrieving search results after quering article.db.');
            // return callback(true, undefined, [dbIndex, dbArticles, dbAdj]);
          }

          entry = results[0];
          content = JSON.parse(entry.content);

          console.log(JSON.stringify(content, undefined, 2));
        });

      });
      // return callback(undefined, results, db);
    });
  });
  //
  // let visited = new Set();
  // let results = [];
  // let queue = [];
  //
  //
  //
  // visited.add(startingArticle);
  //
};

module.exports = {
  searchArticles
};
