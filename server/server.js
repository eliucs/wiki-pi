require('./config/config');

const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const fuzzy = require('fuzzy');
const path = require('path');
const hbs = require('hbs');

const codes = require('./utils/codes');
const { createArticleDataList } = require('./utils/createArticleDataList');
const { deleteCourse } = require('./utils/deleteCourse');
const { normalizePercentage } = require('./utils/normalizePercentage');
const { retrieveSavedCourses } = require('./utils/retrieveSavedCourses');
const { saveCreatedCourse } = require('./utils/saveCreatedCourse');
const { searchArticles } = require('./utils/searchArticles');
const { searchQueryIndex } = require('./utils/searchQueryIndex');

var app = express();

const port = process.env.PORT || 3000;
const partialsPath = path.join(__dirname, '../views/partials');
const staticPath = path.join(__dirname, '../public');

app.use(express.static(staticPath));
hbs.registerPartials(partialsPath);
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '<Wiki-Pi Secret>',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));

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

    req.session.courseCreation = {
      courseCreated: true,
      articleIndexList: results
    };

    return res.status(200).send({
      successCode: codes.SUCCESS_COURSE_CREATED
    });
  });
});

app.get('/new-course-results', (req, res) => {
  // Redirect if course has not yet been created:
  if (!req.session.courseCreation ||
      !req.session.courseCreation.courseCreated) {
    console.log('Redirecting: course not yet created.');
    return res.redirect('/new-course');
  }

  const articleIndexList = req.session.courseCreation.articleIndexList;

  createArticleDataList(articleIndexList, (err, results) => {
    // Check if there was an error:
    if (err) {
      console.log('Error: creating article data list.');
      return res.status(400).send({
        errorCode: err
      });
    }

    // For debug purposes:
    // console.log(JSON.stringify(results, undefined, 2));

    const articlesFound = results.length;

    return res.render('new-course-results.hbs', {
      pageName: 'new-course-results',
      pageTitle: 'New Course Results',
      new: 0,
      articlesFound: articlesFound,
      articlesResults: JSON.stringify(results)
    });
  });
});

app.post('/finish-course-creation', (req, res) => {
  let body = _.pick(req.body, [
    'results'
  ]);

  console.log(body);

  let courseResults = body.results;

  saveCreatedCourse(courseResults, (err, results, db) => {
    // Close the database connection:
    if (db) {
      db.close();
    }
    
    // Check if there was an error:
    if (err) {
      console.log('Error: saving created course.');
      return res.status(400).send({
        errorCode: err
      });
    }

    return res.status(200).send({
      successCode: codes.SUCCESS_SAVING_COURSE_CREATION
    });
  });
});

app.get('/open-course', (req, res) => {
  retrieveSavedCourses((err, results, db) => {
    // Close the database connection:
    if (db) {
      db.close();
    }

    // Check if there was an error:
    if (err) {
      console.log('Error: retrieving saved courses.');
    }

    return res.render('open-course.hbs', {
      pageName: 'open-course',
      pageTitle: 'Open An Existing Course',
      new: 0,
      savedCourses: JSON.stringify(results)
    });
  });
});

app.delete('/delete-course', (req, res) => {
  let body = _.pick(req.body, [
    'id'
  ]);

  console.log(body.id);

  deleteCourse(body.id, (err, success, db) => {
    // Close the database connection:
    if (db) {
      db.close();
    }

    // Check if there was an error:
    if (err) {
      console.log(`Error: deleting course with id ${body.id}.`);
      return res.status(400).send({
        errorCode: err
      });
    }

    return res.status(200).send({
      successCode: success
    });
  });
});

module.exports = {
  app: app
};
