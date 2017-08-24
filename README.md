# Wiki Pi

This is an open source project based in Node.js and the Electron.js framework
for using Wikipedia (English, text only, ~5,000,000 articles) on a Raspberry
Pi to build a low-cost, Internet-free, education resource alternative.

Wiki Pi represents Wikipedia as a graph, takes articles as parameters and
traverses them based on user-defined text similarity and relevance thresholds
to aggregate related articles, and then uses natural language processing
techniques to summarize this text and generate "course content".

Considering the low cost of Raspberry Pi's themselves (~$35), and how the
entirety of Wikipedia could be loaded onto a USB, the primary goal of this
project is to create an educational resource that could be distributed to
disadvantaged schools around the world with little to no internet access.

This project is built around the Raspberry Pi 3 Model B, which can be found on
Amazon [here](https://www.amazon.com/Raspberry-Pi-RASPBERRYPI3-MODB-1GB-Model-Board/dp/B01CD5VC92/ref=sr_1_2?ie=UTF8&qid=1503462178&sr=8-2&keywords=raspberry+pi+3).

## Starting Up

In the terminal:

```
npm start
```

For testing, `babel` transpiles client-side JavaScript from ES6 code to ES5 code,
`gulp-uglify` minifies ES5 code, `nodemon` monitors changes and restarts server:

```
npm test
```

## Wikipedia Data

The dataset used in this project is extracted from a full Wikipedia English
database dump from [MTA Sztaki (Hungarian Academy of Sciences)](http://kopiwiki.dsd.sztaki.hu/),
of ~7 GB compressed, ~20 GB uncompressed. Note that this is an older dump from
2014, but was still used the purpose of proof of concept. Note: they do have a
tool to convert new XML dumps to plain text.

The text content was extracted using the scripts in the `python` folder. The
adjacency list for each article was built by making requests to the Wikipedia
API. The index, article data and adjacency list were saved as a SQLite3 database
for portability reasons with the Raspberry Pi. The total database size is ~36
GB. Note: graph databases, like Neo4j, were not used because of compatibility
issues with the Raspberry Pi, as well as that they are too resource consuming
for a device like the Raspberry Pi, of limited memory (1 GB) and CPU power
(1.2 GHz ARMv8 processor).

The databases are saved onto a USB 3.0 drive (&#8805; 64 GB storage required)
with the name `WIKI-DRIVE`, and the file structure is as follows:

```
.
├── adj
|   ├── 000000.db
|   ...
|   └── 004633.db
├── articles
|   ├── 000000.db
|   ...
|   └── 004633.db
├── index
|   └── index.db
├── courses
|   └── courses.db
```

The adjacency list (adj) and the articles files are large, so they are split
into groups 000000.db - 004633.db, these numbers represent hash codes of the
article titles.
