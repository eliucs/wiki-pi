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
