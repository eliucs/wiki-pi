# Wiki Pi

This is an open source project based in Node.js and the Electron.js framework
for using Wikipedia (English, text only, ~5,000,000 articles) on a Raspberry
Pi to build a low-cost, Internet-free, education resource alternative.

Wiki Pi represents Wikipedia as a graph, takes articles as parameters and
traverses them based on user-defined text similarity and relevance thresholds
to aggregate related articles, and then uses natural language processing 
techniques/algorithms including Porter's Stemmer to normalize text and a 
modified algorithm using tf-idf (term frequency-inverse document frequence)
to perform text summarization (which is explained in the section below), 
and generate "course content".

Considering the low cost of Raspberry Pi's themselves (~$35), and how the
entirety of Wikipedia could be loaded onto a USB, the primary goal of this
project is to create an educational resource that could be distributed to
disadvantaged schools around the world with little to no internet access.

This project is built around the Raspberry Pi 3 Model B, which can be found on
Amazon [here](https://www.amazon.com/Raspberry-Pi-RASPBERRYPI3-MODB-1GB-Model-Board/dp/B01CD5VC92/ref=sr_1_2?ie=UTF8&qid=1503462178&sr=8-2&keywords=raspberry+pi+3).

<table align="center">
    <tr>
        <td>
            <img src="https://i.imgur.com/n3STroV.png" width="384px">
        </td>
        <td>
            <img src="https://i.imgur.com/whmK84I.png" width="384px">
        </td>
    </tr>
</table>

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

Note: this project will be moved to Electron.js.

## Wikipedia Data

The dataset used in this project is extracted from a full Wikipedia English
database dump from [MTA Sztaki (Hungarian Academy of Sciences)](http://kopiwiki.dsd.sztaki.hu/),
of ~7 GB compressed, ~20 GB uncompressed data. Note: this is an older dump 
from 2014, but was still used for the purpose of proof of concept. Note: they 
do have a tool to convert new XML dumps to plain text.

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

## Algorithm

The following descriptions and pseudocode give a general overview of how 
articles are selected, normalized and summarized, before being put together into
a course.

### Selecting

As the section Wikipedia Data above describes, we deal with the index, articles
and adjacency list database. The query is given by a starting article title and 
a threshold value for similarity between 0 and 100. The general idea is to run 
BFS starting from that article, aggregating all of its adjacent articles, 
running Porter's Stemmer to normalize the articles, and then converting them 
into a term frequency vector, with which we compare the cosine similarity to 
the starting article's term frequency vector. This cosine value is mapped to a 
value between 0 and 100, and articles where the similarity is less than the 
threshold are filtered out, and not considered part of the final course.

Pseudocode:

```
Index : Index[t] maps article title t to some hashcode value between 0 - 4633
Articles : Article[x] gets all of the articles whose titles hash to x, 
           Article[x][t] gets the text content of that particular article with 
           title t
Adj : Adj[x] gets all of the adjacency lists whose titles hash to x,
      Adj[x][t] gets the adjacency list of that particular article with 
      title t
s : starting article title
threshold : threshold value
Q : queue of articles yet to be processed
C : list of articles currently belonging to the course

C.append(s)
Q.enqueue(s)

threshold = threshold / 100 // convert threshold into a value between 0 and 1

while Q is not empty:
    current = Q.dequeue()
    hashcode = Index[current.title]
    textContent = Articles[hashcode][current.title]

    v = PorterStemmer.stem(textContent) // normalization step
    v = convertToTfVector(v)

    adj = Adj[hashcode][current.title]

    for title t in adj:
        hashcodeTemp = Index[t]
        textContentTemp = Articles[hashcodeTemp][t]

        u = PorterStemmer.stem(textContentTemp) // normalization step
        u = convertToTfVector(u)

        theta = arccos(dotProduct(v, u) / (norm(v) * norm(u)))
        similarity = (arccos(0) - theta) / arccos(0)

        if similarity >= threshold:
            Q.enqueue(t)
            C.append(textContentTemp)

```

### Normalizing and Summarizing

Text summarization of the articles is done through an extractive method that 
uses Porter's Stemmer and tf-idf. The main idea behind it is that after the 
text is normalized, the whole article text itself and the individual sentences
are converted into vectors, and tf-idf is used to check the similarity/saliency
of the sentences to the article as a whole, and if the sentence meets a 
similarity threshold, then the sentence is kept, otherwise it is omitted, and 
the first sentence is always kept. It uses log frequency weighting for tf. 
This approach can summarize texts fast, and maintains the relevancy of the 
sentences surprisingly well.

Pseudocode:

```
article : entire article text
summarizedText : list of sentence that are included in the final summary
svectors : list of sentence tf vectors
threshold : threshold value for similarity between 0 and 1
idf : maps each word in article to a count

sentences = tokenizeSentences(article)

firstSentence = sentences[0]
summarizedText = firstSentence.append(firstSentence) // first sentence is always kept

article = PorterStemmer.stem(article) // normalization step
article = convertToTfVector(article)
N = article.length

for sentence s in sentences:
    sv = PorterStemmer.stem(s)
    sv = convertToTfVector(s)
    svectors.append(sv)

    for word w in s:
        idf[w]++

for word w in article:
    idf[word] = log(N/idf[word])
    w.tfIdf = (1 + log(w.tf)) * idf[word]

for vector sv in svectors:
    sv.tfIdf = 1 + log(sv.tf) * idf[word]

    theta = arccos(dotProduct(sv, article) / (norm(sv) * norm(article)))
    similarity = (arccos(0) - theta) / arccos(0)

    if similarity >= threshold:
        summarizedText.append(sv)

```
