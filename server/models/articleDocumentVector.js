const mongoose = require('mongoose');

var ArticleDocumentVectorSchema = new mongoose.Schema({
  _articleId: {
    type: mongoose.Schema.Types.ObjectId
  },
  articleDocumentVector: [
    {
        key: {
          type: String
        },
        value: {
          type: Number
        },
        size: {
          type: Number
        }
    }
  ]
});

var ArticleDocumentVector = mongoose.model('ArticleDocumentVector',
  ArticleDocumentVectorSchema);

module.exports = {
  ArticleDocumentVector
};
