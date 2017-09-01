/**
*
* createArticleDataList.js
*
* This module takes in a list of article index (title, location) pairs, and
* queries the database to get their corresponding article content, and 
* returns a Promise. If the query is successful, then it resolves the 
* Promise with the article data, otherwise, reject the Promise with an 
* error Object.
*
**/

const path = require('path');
const sqlite = require('sqlite-sync');
const { convertArticleDataToJSON } = require('./convertArticleDataToJSON');
const ARTICLE_LOCATION = path.resolve('/Volumes/WIKI-DRIVE/articles');

const createArticleDataList = (articleIndexList) => {
  // For debug purposes:
  console.log('Current Course Results:');
  console.log(JSON.stringify(articleIndexList, undefined, 2));

  return new Promise((resolve, reject) => {
    // Check if the article index list is null:
    if (!articleIndexList) {
      reject({ nullArticleIndexList: true });
      return;
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
  
      // Skip empty articleData:
      if (!articleData || !articleData.title || !articleData.content) {
        return;
      }
  
      results.push(articleData);
    });

    resolve(convertArticleDataToJSON(results));
  });
};

module.exports = {
  createArticleDataList
};
