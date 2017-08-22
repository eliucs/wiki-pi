require('./config/config');

const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const fuzzy = require('fuzzy');
const path = require('path');
const hbs = require('hbs');

const codes = require('./utils/codes');
const {normalizePercentage} = require('./utils/normalizePercentage');
const {searchArticles} = require('./utils/searchArticles');
const {searchQueryIndex} = require('./utils/searchQueryIndex');

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
    pageName: 'about',
    pageTitle: 'About'
  });
});

app.get('/help', (req, res) => {
  res.render('help.hbs', {
    pageName: 'help',
    pageTitle: 'Help'
  });
});

app.get('/new-course', (req, res) => {
  res.render('new-course.hbs', {
    pageName: 'new-course',
    pageTitle: 'Create A New Course',
    new: 1
  });
});

app.get('/search-courses', (req, res) => {
  const searchQuery = req.query.q;

  searchQueryIndex(searchQuery, (err, results, db) => {
    // Close the database connection:
    db.close();

    // Check if there was an error:
    if (err) {
      console.log('Error: retrieving search results from index.');
      return res.status(400).send({
        errorCode: codes.ERROR_NOT_ARTICLE_FOUND
      });
    }

    return res.status(200).send(results);
  });
});

app.post('/new-course', (req, res) => {
  let body = _.pick(req.body, [
    'startingArticle',
    'textSimilarity'
  ]);

  const startingArticle = body.startingArticle;
  const textSimilarity = normalizePercentage(body.textSimilarity);

  searchArticles(startingArticle, textSimilarity, (err, results) => {
    // Check if there was an error:
    if (err) {
      console.log('Error: creating course.');
      return res.status(400).send({
        errorCode: err
      });
    }

    console.log('Results:');
    results.forEach((article) => {
      console.log(article);
    });

    req.session['results'] = {
      initialized: true,
      results: results
    };

    return res.status(200).send({
      successCode: codes.SUCCESS_COURSE_CREATED
    });
  });
});

app.get('/new-course-results', (req, res) => {

  res.render('new-course-results.hbs', {
    pageName: 'new-course-results',
    pageTitle: 'New Course Results',
    new: 0,
    articlesFound: 10
  });
});

app.get('/open-course', (req, res) => {
  res.render('open-course.hbs', {
    pageName: 'open-course',
    pageTitle: 'Open An Existing Course',
    new: 0
  });
});

module.exports = {
  app: app
};
