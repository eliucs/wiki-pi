const express = require('express');
const path = require('path');
const hbs = require('hbs');

var app = express();

const port = process.env.PORT || 3000;

const partialsPath = path.join(__dirname, '../views/partials');
const staticPath = path.join(__dirname, '../public');

app.use(express.static(staticPath));
hbs.registerPartials(partialsPath);
app.set('view engine', 'hbs');

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.get('/', function(req, res) {
  res.render('index.hbs');
});

app.get('/about', function(req, res) {
  res.render('about.hbs', {
    pageName: "about",
    pageTitle: "About"
  });
});

app.get('/help', function(req, res) {
  res.render('help.hbs', {
    pageName: "help",
    pageTitle: "Help"
  });
});

app.get('/new-course', function(req, res) {
  res.render('new-course.hbs', {
    pageName: "new-course",
    pageTitle: "Create A New Course"
  });
});

app.get('/open-course', function(req, res) {
  res.render('open-course.hbs', {
    pageName: "open-course",
    pageTitle: "Open An Existing Course"
  });
});

module.exports = {
  app: app
};
