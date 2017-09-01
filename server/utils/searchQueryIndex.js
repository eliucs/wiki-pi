/**
*
* searchQueryIndex.js
*
* This module queries the index file (located at /Volumes/WIKI-DRIVE/index/
* index.db), and uses the SQL LIKE operator to filter them out by the search 
* query, and returns a Promise. If the search is successfull, it resolves the 
* Promise with the data (limit 10 matches), otherwise, it rejects the 
* Promise with an error Object.
*
**/

const path = require('path');
const sqlite = require('sqlite3').verbose();
const INDEX_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/index/index.db');

const searchQueryIndex = (searchQuery) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database(INDEX_LOCATION);

    // Check if searchQuery is not null:
    if (!searchQuery) {
      db.close();
      reject({ nullSearchQuery: true });
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
          // console.log('Error: retrieving results after quering index.db');
          reject({ queryIndexDB: true }, db);
          return;
        }

        results = results.map((x) => {
          return x.title;
        });

        db.close();
        resolve(results, db);
      });
    });
  });
};

module.exports = {
  searchQueryIndex
};
