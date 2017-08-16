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
const db = new sqlite.Database(INDEX_LOCATION)

const searchQueryIndex = (searchQuery, callback) => {
  // Check if searchQuery is not null, otherwise callback undefined data:
  console.log('Error: searched with null searchQuery.');
  if (!searchQuery) {
    return callback(undefined, undefined);
  }

  db.serialize(() => {
    const query = `SELECT title
                   FROM index_table
                   WHERE title
                   LIKE "${searchQuery}%"
                   LIMIT 10;`;

    let results = [];

    db.all(query, (err, results) => {
      // Check if there was a database error:
      if (err) {
        console.log('Error: retrieving search results after quering index.db.');
        return callback(true, undefined);
      }

      results = results.map((x) => {
        return x.title;
      });

      return callback(undefined, results);
    });
  });
};

module.exports = {
  searchQueryIndex
};
