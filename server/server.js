require('./config/config');

const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const fuzzy = require('fuzzy');
const path = require('path');
const hbs = require('hbs');

// const codes = require('./utils/codes');
const indexArticleTitles = require('./../testing/article-index-titles.json');

var app = express();

const port = process.env.PORT || 3000;
const partialsPath = path.join(__dirname, '../views/partials');
const staticPath = path.join(__dirname, '../public');

app.use(express.static(staticPath));
hbs.registerPartials(partialsPath);
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.get('/', (req, res) => {
  res.render('index.hbs');
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageName: "about",
    pageTitle: "About"
  });
});

app.get('/help', (req, res) => {
  res.render('help.hbs', {
    pageName: "help",
    pageTitle: "Help"
  });
});

app.get('/new-course', (req, res) => {
  res.render('new-course.hbs', {
    pageName: "new-course",
    pageTitle: "Create A New Course",
    new: 1
  });
});

app.post('/new-course', (req, res) => {
  var body = _.pick(req.body, [
    'startingArticle',
    'endingArticle',
    'textSimilarity'
  ]);

  console.log(body);
});

app.get('/new-course-results', (req, res) => {
  res.render('new-course-results.hbs', {
    pageName: "new-course-results",
    pageTitle: "New Course Results",
    new: 0,
    articlesFound: 10
  });
});

app.get('/open-course', (req, res) => {
  res.render('open-course.hbs', {
    pageName: "open-course",
    pageTitle: "Open An Existing Course",
    new: 0
  });
});

app.get('/search-courses', (req, res) => {
  const searchQuery = req.query.q;

  var searchResultsList = indexArticleTitles
  .map((entry) => {
      return entry.title
  });

  var searchResults = fuzzy
  .filter(searchQuery, searchResultsList)
  .map(function(entry) {
    return entry.string;
  });

  console.log(searchResults);

  return res.send(searchResults);
});

module.exports = {
  app: app
};
