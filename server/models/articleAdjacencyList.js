/**
* ArticleAdjacencyList is used to correspond each article with their outgoing
* links to other articles, which are represented here as an adjacency list
* in the sense of graphs.
**/

const mongoose = require('mongoose');

var ArticleAdjacencyListSchema = new mongoose.Schema({
  articleTitle: {
    type: String
  },
  articleAdjacencyList: [
    {
      articleTitle: {
        type: String
      }
    }
  ]
});

var ArticleAdjacencyList = mongoose.model('ArticleAdjacencyList',
  ArticleAdjacencyListSchema, 'articleAdjacencyLists');

module.exports = {
  ArticleAdjacencyList
};
