/**
*
* createArticleDataList.js
*
* This module takes in a list of article index (title, location) pairs, and
* queries the database to get their corresponding article content.
*
**/

const path = require('path');
const sqlite = require('sqlite-sync');

const codes = require('./codes');

const ARTICLE_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/articles');

const createArticleDataList = (articleIndexList, callback) => {
  // For debug purposes:
  console.log('Current Course Results:');
  console.log(JSON.stringify(articleIndexList, undefined, 2));

  if (!articleIndexList) {
    console.log('Error: null article index list.');
    return callback(codes.ERROR_NULL_ARTICLE_INDEX_LIST, undefined);
  }

  let results = [];

  articleIndexList.forEach((articleIndex) => {
    // For debug purposes:
    console.log(articleIndex.title);
    console.log(articleIndex.location);
    console.log(`${ARTICLE_LOCATION}/${articleIndex.location}.db`);

    sqlite.connect(`${ARTICLE_LOCATION}/${articleIndex.location}.db`);
    let articleData = sqlite.run(`SELECT title, content
                                         FROM articles_table
                                         WHERE title = "${articleIndex.title}"
                                         LIMIT 1;`)[0];
    sqlite.close();

    if (!articleData || !articleData.title || !articleData.content) {
      return;
    }

    results.push(articleData);
  });

  return callback(undefined, results);
};

module.exports = {
  createArticleDataList
};
