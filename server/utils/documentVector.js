/**
 * 
 * documentVector.js
 * 
 * This module is the DocumentVector class.
 * 
 */

 class DocumentVector {

  constructor(document) {
    this.tokenFrequencyVector = {};
    this.size = 0;

    if (document) {
      this.addDocument(document);
    }
  }

  addDocument(document) {
    document.forEach((token) => {
      if (!this.tokenFrequencyVector.hasOwnProperty(token)) {
        this.tokenFrequencyVector[token] = 1;
        this.size++;
      } else {
        this.tokenFrequencyVector[token]++;
      }
    });
  }

  dotProduct(that) {
    let k = {};
    let dp = 0;

    Object.keys(this.tokenFrequencyVector).forEach((token) => {
      if (!k.hasOwnProperty(token)) {
        k[token] = 1;
      }
    });

    Object.keys(that.tokenFrequencyVector).forEach((token) => {
      if (!k.hasOwnProperty(token)) {
        k[token] = 1;
      }
    });

    Object.keys(k).forEach((key) => {
      dp += (this.tokenFrequencyVector.hasOwnProperty(key) ?
                      this.tokenFrequencyVector[key] : 0) *
                    (that.tokenFrequencyVector.hasOwnProperty(key) ?
                      that.tokenFrequencyVector[key] : 0);
    });

    return dp;
  }

  euclideanNorm() {
    let s = 0;
    Object.keys(this.tokenFrequencyVector).forEach((token) => {
      s += Math.pow(this.tokenFrequencyVector[token], 2);
    });
    return Math.sqrt(s);
  }

  euclideanNormProduct(that) {
    return this.euclideanNorm() * that.euclideanNorm();
  }

  cosineDistanceTo(that) {
    return Math.acos(this.dotProduct(that) / this.euclideanNormProduct(that));
  }

  static mapRange(cosineDistance) {
    return (Math.acos(0) - cosineDistance) / Math.acos(0);
  }
}

module.exports = DocumentVector;
