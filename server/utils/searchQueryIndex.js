/**
*
* searchQueryIndex.js
*
* This module queries the index file (located at /Volumes/WIKI-DRIVE/index/
* index.db) and uses the SQLite LIKE operator to filter them by the search
* query.
*
**/

const path = require('path');
const sqlite = require('sqlite3').verbose();

const INDEX_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/index/index.db');


const searchQueryIndex = (searchQuery, callback) => {
  const db = new sqlite.Database(INDEX_LOCATION);

  // Check if searchQuery is not null, otherwise callback undefined data:
  if (!searchQuery) {
    console.log('Error: searched with null searchQuery.');
    return callback(undefined, undefined, db);
  }

  db.serialize(() => {
    const query = `SELECT title
                   FROM index_table
                   WHERE title
                   LIKE "${searchQuery}%"
                   LIMIT 10;`;

    db.all(query, (err, results) => {
      // Check if there was a database error:
      if (err) {
        console.log('Error: retrieving search results after quering index.db.');
        return callback(true, undefined, db);
      }

      results = results.map((x) => {
        return x.title;
      });

      return callback(undefined, results, db);
    });
  });
};

module.exports = {
  searchQueryIndex
};
