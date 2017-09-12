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
const { isNumber } = require('./utils/isNumber');
const { markSectionCompleted } = require('./utils/markSectionCompleted');
const { normalizePercentage } = require('./utils/normalizePercentage');
const { openCourse } = require('./utils/openCourse');
const { retrieveSavedCourses } = require('./utils/retrieveSavedCourses');
const { saveCreatedCourse } = require('./utils/saveCreatedCourse');
const { searchArticles } = require('./utils/searchArticles');
const { searchQueryIndex } = require('./utils/searchQueryIndex');
const { updateTimeSpent } = require('./utils/updateTimeSpent');

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

// POST /open-course
app.post('/open-course', (req, res) => {
  let body = _.pick(req.body, [
    'id'
  ]);

  console.log(body.id);

  openCourse(body.id)
  .then((result) => {
    console.log('Success: opened course.');
    req.session.courseOpened = result;
    return res.status(200).send({
      courseOpened: true
    });
  })
  .catch((err) => {
    console.log(err);
    if (err.openCourseNullID) {
      console.log('Error: opening course with null id.');
    } else if (err.openingCourseFromDB) {
      console.log('Error: a problem occurred opening course from database.');
    }
    return res.status(400).send(err);
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

// GET /course-overview
app.get('/course-overview', (req, res) => {
  // Redirect if current session has not opened a course:
  if (!req.session.courseOpened) {
    console.log('Redirecting: course not yet opened.');
    return res.redirect('/open-course');
  }

  // For debugging:
  // console.log(req.session.courseOpened);

  // Update time:
  // Only update this value if it has already been initialized, and then 
  // reset the timestamp:
  updateTimeSpent({
    courseTime: req.session.courseTime,
    courseID: req.session.courseOpened.id
  })
  .then((result) => {
    req.session.courseTime = result.courseTime;
    req.session.courseOpened.timeSpentContent = result.timeSpentContent;
  })
  .catch((error) => {
    console.log(error);
    if (error.nullCourseTime) {
      console.log('Error: null course time.');
    } else if (error.noTimeDifference) {
      console.log('Error: no time difference.');
    } else if (error.nullCourseID) {
      console.log('Error: null course ID.');
    } else if (error.updatingTimeDB) {
      console.log('Error: updating time to database.');
    }
  })
  .then(() => {
    console.log(req.session.courseTime);
    return res.render('course-overview.hbs', {
      courseOpened: JSON.stringify(req.session.courseOpened)
    });
  });
});

// GET /course-overview/:id
app.get('/course-overview/:id', (req, res) => {
  // Redirect if current session has not opened a course:
  if (!req.session.courseOpened) {
    console.log('Redirecting: course not yet opened.');
    return res.redirect('/open-course');
  } else if (!isNumber(req.params.id)) {
    console.log('Redirecting: course ID not valid.');
    return res.redirect('/course-overview');
  }

  const sections = JSON.parse(req.session.courseOpened.course);
  if (!(req.params.id < sections.length && req.params.id >= 0)) {
    console.log(req.params.id);
    console.log('Redirecting: course ID not valid.');
    return res.redirect('/course-overview');
  }

  // Update time spent:
  req.session.courseTime = {
    timestampContent: Date.now()
  };
  console.log(req.session.courseTime);

  return res.render('section.hbs', {
    sectionData: JSON.stringify(sections[req.params.id]),
    sectionID: req.params.id
  });
});

// GET /course-completed
app.post('/course-completed', (req, res) => {
  let body = _.pick(req.body, [
    'sectionID'
  ]);

  // For debugging:
  // console.log('Course ID:', req.session.courseOpened.id);
  // console.log('Section ID:', body.sectionID);
  // console.log(req.session.courseOpened);

  markSectionCompleted({
    courseData: req.session.courseOpened,
    courseID: req.session.courseOpened.id,
    sectionID: body.sectionID
  })
  .then((result) => {
    // After the database is updated, update the data in the session:
    req.session.courseOpened = result;
    console.log(req.session.courseOpened);

    return res.status(200).send({
      courseUpdated: true
    });
  })
  .catch((err) => {
    console.log(err);
    if (err.nullCourseData) {
      console.log('Error: course data is null.');
    } else if (err.nullCourseID) {
      console.log('Error: course ID is null.');
    } else if (err.nullSectionID) {
      console.log('Error: section ID is null.');
    } else if (err.updatingCourseDB) {
      console.log('Error: problem updating database.');
    }
    return res.status(400).send(err);
  });
});

module.exports = {
  app
};
