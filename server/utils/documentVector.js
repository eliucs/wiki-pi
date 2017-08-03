/**
* The DocumentVector structure.
**/
function DocumentVector(document) {
  this.tokenFrequencyVector = {};
  this.size = 0;

  if (document) {
    this.addDocument(document);
  }
}

/**
* Add a document (list of string tokens) to the DocumentVector, and build
* up the token frequency vector.
**/
DocumentVector.prototype.addDocument = function(document) {
  document.forEach((token) => {
    if (!this.tokenFrequencyVector.hasOwnProperty(token)) {
      this.tokenFrequencyVector[token] = 1;
      this.size++;
    } else {
      this.tokenFrequencyVector[token]++;
    }
  });
};

/**
* Return the dot product (inner product) between this token frequency vector
* and that of another DocumentVector.
**/
DocumentVector.prototype.dotProduct = function(that) {
  var k = {};
  var dotProduct = 0;

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
    dotProduct += (this.tokenFrequencyVector.hasOwnProperty(key) ?
                   this.tokenFrequencyVector[key] : 0) *
                  (that.tokenFrequencyVector.hasOwnProperty(key) ?
                   that.tokenFrequencyVector[key] : 0);
  });

  return dotProduct;
};

/**
* Return the Euclidean Norm of this token frequency vector.
**/
DocumentVector.prototype.euclideanNorm = function() {
  var s = 0;
  Object.keys(this.tokenFrequencyVector).forEach((token) => {
    s += Math.pow(this.tokenFrequencyVector[token], 2);
  });
  return Math.sqrt(s);
};

/**
* Return the product between the Euclidean norms of this token freqeuncy vector
* and that of another DocumetVector.
**/
DocumentVector.prototype.euclideanNormProduct = function(that) {
  return this.euclideanNorm() * that.euclideanNorm();
};

/**
* Return the cosine distance this token frequency vector and that of another
* DocumentVector.
**/
DocumentVector.prototype.cosineDistanceTo = function(that) {
  return Math.acos(this.dotProduct(that) / this.euclideanNormProduct(that));
};

/**
* Static method to map the cosine distance to a value in the range [0..1]
**/
DocumentVector.mapRange = function(cosineDistance) {
  return (Math.acos(0) - cosineDistance) / Math.acos(0);
};

module.exports = DocumentVector;
