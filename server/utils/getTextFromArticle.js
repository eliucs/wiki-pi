/**
 * 
 * getTextFromArticle.js
 * 
 * This module gets only the text content from a given article.
 * 
 */

 const getTextFromArticle = (content) => {
     let articleText = '';
     content.forEach((c) => {
        // h = 0 is paragraph text
        if (c.h === 0) {
            articleText += c.txt;
        }
     });
     return articleText;
 };

 module.exports = {
     getTextFromArticle
 };
