require('./config/config');

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const _ = require('lodash');
const {mongoose} = require('./db/mongoose');
const {Article} = require('./models/article');
const {findArticlesLimited} = require('./utils/findArticlesLimited');
const {findArticlesUnlimited} = require('./utils/findArticlesUnlimited');

const codes = require('./utils/codes');

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

  // For debug purposes:
  console.log(body.startingArticle);

  Article.findOne({
    articleTitle: body.startingArticle
  }).then((article) => {
    // No article found:
    if (!article) {
      console.log('Error: no article found.');
      return res.status(400).send({
        errorCode: codes.ERROR_NO_ARTICLE_FOUND
      });
    }

    // Article found:
    console.log('Success: article found.');
    console.log(article);
    console.log();

    // Find course articles limited by starting and ending articles:
    if (body.endingArticle) {
      const results = findArticlesLimited(body.startingArticle,
                                          body.endingArticle,
                                          body.textSimilarity);
      // console.log(results);
    }
    // Find course articles unlimited, from starting article and limited
    // solely by comparing text similarity scores:
    else {
      findArticlesUnlimited(article, body.textSimilarity, (processed) => {
        console.log(processed);
      });  
    }

    return res.status(200).send({
      successCode: codes.SUCCESS_COURSE_ARTICLES_FOUND
    });

  }).catch((error) => {
    // Error connecting to database:
    console.log('Error: connecting to database.');
    console.log(error);
    return res.status(400).send({
      errorCode: codes.ERROR_CONNECTING_TO_DB
    });
  });
});

app.get('/open-course', (req, res) => {
  res.render('open-course.hbs', {
    pageName: "open-course",
    pageTitle: "Open An Existing Course",
    new: 0
  });
});

module.exports = {
  app: app
};
