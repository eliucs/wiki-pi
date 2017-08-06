/**
* ArticleTitle stores solely the name of the article, primarily used to
* avoid accessing the main Article database for simple requests.
**/

const mongoose = require('mongoose');

var ArticleTitleSchema = new mongoose.Schema({
  articleTitle: {
    type: String
  }
});

var ArticleTitle = mongoose.model('ArticleTitle', ArticleTitleSchema);

module.exports = {
  ArticleTitle
};
