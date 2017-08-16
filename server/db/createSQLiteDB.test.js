/**
* createSQLiteDB.test.js
*
* This module is used to test creating and writing to the database.
**/

const sqlite = require('sqlite3').verbose();

const DB_LOCATION = 'testing/test.db';
const db = new sqlite.Database(DB_LOCATION);

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS test_table (info TEXT)');
  const statement = db.prepare('INSERT INTO test_table VALUES (?)');

  for (var i = 0; i < 10; i++) {
    statement.run(`Test ${i}`);
  }

  statement.finalize();

  db.each('SELECT rowid AS id, info FROM test_table', (err, row) => {
    if (err) {
      return console.log(`Error: Problems reading from ${DB_LOCATION}`);
    }

    console.log(`${row.id}: ${row.info}`);
  });
});

db.close();
