var normalizeDocumentText = (article) => {
  if (!article || !article.articleBody || article.articleBody.length === 0) {
    return null;
  }
  var d = '';
  article.articleBody.forEach((section) => {
    d += section.sectionBody;
  });
  return d;
};

module.exports = {
  normalizeDocumentText
};
