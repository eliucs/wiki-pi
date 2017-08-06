/**
* Article stores Objects containing the article's title and body, which
* is a list of Objects of the sections of that article.
**/

const mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
  articleTitle: {
    type: String
  },
  articleBody: [
    {
      sectionTitle: {
        type: String
      },
      sectionHeading: {
        type: Number
      },
      sectionBody: {
        type: String
      }
    }
  ]
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = {
  Article
};
