/**
*
* convertArticleDataToJSON.js
*
* This module fixes the articleDataList by mapping the JSON.parse() function
* to the content field for each element in the list.
*
**/

const convertArticleDataToJSON = (articleDataList) => {
  return articleDataList.map((article) => {
    return {
      title: article.title,
      content: JSON.parse(article.content)
    };
  });
};

module.exports = {
  convertArticleDataToJSON
};
