const mongoose = require('mongoose');

var ArticleAdjacencyListSchema = new mongoose.Schema({
  _articleId: {
    type: mongoose.Schema.Types.ObjectId
  },
  articleAdjacencyList: [
    {
      _articleId: {
        type: mongoose.Schema.Types.ObjectId
      }
    }
  ]
});

var ArticleAdjacencyList = mongoose.model('ArticleAdjacencyList',
  ArticleAdjacencyListSchema);

module.exports = {
  ArticleAdjacencyList
};
