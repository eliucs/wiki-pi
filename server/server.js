require('./config/config');

const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const fuzzy = require('fuzzy');
const fs = require('fs');
const hbs = require('hbs');
const marked = require('marked');
const path = require('path');
const session = require('express-session');

// Utils:
const { createArticleDataList } = require('./utils/createArticleDataList');
const { deleteCourse } = require('./utils/deleteCourse');
const { normalizePercentage } = require('./utils/normalizePercentage');
const { retrieveSavedCourses } = require('./utils/retrieveSavedCourses');
const { saveCreatedCourse } = require('./utils/saveCreatedCourse');
const { searchArticles } = require('./utils/searchArticles');
const { searchQueryIndex } = require('./utils/searchQueryIndex');

// Configure markdown renderer:
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

var app = express();

const port = process.env.PORT || 3000;
const partialsPath = path.join(__dirname, '../views/partials');
const staticPath = path.join(__dirname, '../public');

app.use(express.static(staticPath));
hbs.registerPartials(partialsPath);
app.set('view engine', 'hbs');
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({ 
  limit: '50mb',
  extended: false 
}));
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
  return res.render('index.hbs');
});

app.get('/about', (req, res) => {
  let aboutFilePath = 'content/information/about.md';
  fs.readFile(aboutFilePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }
    return res.render('information.hbs', {
      pageContent: marked(data)
    });
  });
});

app.get('/help', (req, res) => {
  let helpFilePath = 'content/information/help.md';
  fs.readFile(helpFilePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }
    return res.render('information.hbs', {
      pageContent: marked(data)
    });
  });
});

app.get('/new-course', (req, res) => {
  res.render('new-course.hbs', {
    pageName: 'new-course',
    pageTitle: 'Create A New Course',
    new: 1
  });
});

// GET /search-courses
app.get('/search-courses', (req, res) => {
  const searchQuery = req.query.q;

  searchQueryIndex(searchQuery)
  .then((results) => {
    return res.status(200).send(results);
  })
  .catch((err, db) => {
    if (err.nullSearchQuery) {
      console.log('Error: searched with null searchQuery.');
    } else if (err.queryIndexDB) {
      console.log('Error: retrieving results after quering index.db');
    }
    return res.status(400).send(err);
  });
});

// POST /new-course
app.post('/new-course', (req, res) => {
  let body = _.pick(req.body, [
    'startingArticle',
    'textSimilarity'
  ]);

  const startingArticle = body.startingArticle;
  const percentage = body.textSimilarity;

  normalizePercentage(percentage)
  .then((textSimilarity) => {
    return searchArticles({ startingArticle, textSimilarity });
  })
  .then((results) => {
    console.log('Results:');
    results.forEach((article) => {
      console.log(article);
    });

    req.session.courseCreation = {
      courseCreated: true,
      articleIndexList: results
    };

    return res.status(200).send({
      courseCreated: true
    });
  })
  .catch((err) => {
    console.log(err);
    if (err.percentageNotANumber) {
      console.log('Error: percentage is not a number.');
    } else if (err.percentageIncorrectRange) {
      console.log('Error: percentage is not within range 0 - 100.');
    } else if (err.nullStartingArticle) {
      console.log('Error: the starting article is null.');
    } else if (err.retrievingStartingArticleIndex) {
      console.log('Error: retrieving starting article from index db.');
    } else if (err.retrievingStartingArticleData) {
      console.log('Error: retrieving starting article data from articles db.');
    }
    return res.status(400).send(err);
  });
});

// GET /new-course-results
app.get('/new-course-results', (req, res) => {
  // Redirect if course has not yet been created:
  if (!req.session.courseCreation ||
      !req.session.courseCreation.courseCreated) {
    console.log('Redirecting: course not yet created.');
    return res.redirect('/new-course');
  }

  const articleIndexList = req.session.courseCreation.articleIndexList;

  createArticleDataList(articleIndexList)
  .then((results) => {
    const articlesFound = results.length;
    
    return res.render('new-course-results.hbs', {
      pageName: 'new-course-results',
      pageTitle: 'New Course Results',
      new: 0,
      articlesFound: articlesFound,
      articlesResults: JSON.stringify(results)
    });
  })
  .catch((err) => {
    console.log(err);
    if (err.nullArticleIndexList) {
      console.log('Error: the article index list is null.');
    }
    return res.status(400).send(err);
  });
});

// POST /finish-course-creation
app.post('/finish-course-creation', (req, res) => {
  let body = _.pick(req.body, [
    'results'
  ]);

  // For debug purposes:
  console.log(body);

  let courseResults = body.results;

  saveCreatedCourse(courseResults)
  .then((results) => {
    return res.status(200).send({
      savedCourse: true
    });
  })
  .catch((err) => {
    console.log(err);
    if (err.nullCourseResults) {
      console.log('Error: course results being saved is null.');
    } else if (err.creatingTable) {
      console.log('Error: creating table while saving course.');
    } else if (err.insertingIntoTable) {
      console.log('Error: inserting into table while saving course.');
    }
    return res.status(400).send(err);
  });
});

// GET /open-course
app.get('/open-course', (req, res) => {
  retrieveSavedCourses()
  .then((results) => {
    return res.render('open-course.hbs', {
      pageName: 'open-course',
      pageTitle: 'Open An Existing Course',
      new: 0,
      savedCourses: JSON.stringify(results)
    });
  })
  .catch((err) => {
    console.log(err);
    if (err.retrievingSavedCourses) {
      console.log('Error: retrieving search results after quering courses.db.');
    }
    return res.render('open-course.hbs', {
      pageName: 'open-course',
      pageTitle: 'Open An Existing Course',
      new: 0,
      savedCourses: []
    });
  });
});

// DELETE /delete-course
app.delete('/delete-course', (req, res) => {
  let body = _.pick(req.body, [
    'id'
  ]);

  console.log(body.id);

  deleteCourse(body.id)
  .then(() => {
    console.log('Success: deleted course.');
    return res.status(200).send({
      courseDeleted: true
    });
  })
  .catch((err) => {
    console.log(err);
    if (err.deleteCourseNullID) {
      console.log('Error: deleting course with null id.');
    } else if (err.deletingCourseFromDB) {
      console.log('Error: a problem occurred deleting course from database.');
    }
    return res.status(400).send(err);
  });
});

app.get('/course-overview', (req, res) => {
  return res.render('course-overview.hbs');
});

module.exports = {
  app
};
