const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const _ = require('lodash');

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
    pageTitle: "Create A New Course"
  });
});

app.post('/new-course', (req, res) => {
  var body = _.pick(req.body, [
    'startingArticle',
    'endingArticle',
    'textSimilarity'
  ]);

  // For debug purposes:
  console.log(body);


});

app.get('/open-course', (req, res) => {
  res.render('open-course.hbs', {
    pageName: "open-course",
    pageTitle: "Open An Existing Course"
  });
});

module.exports = {
  app: app
};
