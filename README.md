# Wiki Pi

This is an open source project based in Node.js and the Electron.js framework
for using Wikipedia (English, text only, ~ 5 000 000 articles) on a Raspberry
Pi to build a low-cost, Internet-free, education resource alternative.

Wiki Pi represents Wikipedia as a graph, takes articles as parameters and
traverses them based on user-defined text similarity and relevance thresholds
to aggregate related articles, and then uses natural language processing
techniques to summarize this text and generate "course content".

Considering the low cost of Raspberry Pi's themselves (~ $35), and how the
entirety of Wikipedia could be loaded onto a USB, the primary goal of this
project is to create an educational resource that could be distributed to
disadvantaged schools around the world with little to no internet access.

## Starting Up

In the terminal:

```
npm start
```

For testing, babel transpiles client-side JavaScript from ES6 code to ES5 code,
gulp-uglify minifies ES5 code, nodemon monitors changes and restarts server when
needed:

```
npm test
```
