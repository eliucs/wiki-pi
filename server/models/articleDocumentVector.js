/**
* ArticleDocumentVector is used as a speed optimization for comparing article
* texts, these DocumentVector's are precomputed and saved.
**/

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
        }
    }
  ]
});

var ArticleDocumentVector = mongoose.model('ArticleDocumentVector',
  ArticleDocumentVectorSchema);

module.exports = {
  ArticleDocumentVector
};
