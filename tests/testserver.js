var expect  = require("chai").expect;
var request = require("request");
var path = require('path');
var app = require(path.join(__dirname, '..','index.js'));

describe('Blobs', function() {
  it('should list ALL blobs on /blobs GET');
  it('should list a SINGLE blob on /blob/<id> GET');
  it('should add a SINGLE blob on /blobs POST');
  it('should update a SINGLE blob on /blob/<id> PUT');
  it('should delete a SINGLE blob on /blob/<id> DELETE');
});
