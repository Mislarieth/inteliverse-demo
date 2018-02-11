const uuidv4 = require('uuid/v4');
var crypto = require('crypto');

/*
  hashes an object
*/
var hash=function(obj){
  const hashbase = crypto.createHash('sha256');
  hashbase.update(JSON.stringify(obj));
  return hashbase.digest('hex');
}

var genid=function(){
  return hash(Math.random());
}

/*
  Object with two parts:
    metadata
      blockid
      version
    data
      key1
        version
        value
      key2
        version
        value
*/
function block(initialmeta,initialdata){
  this.metadata={};
  if(initialmeta){
    this.metadata=initialmeta;

  }
  if(!this.metadata.blockid){
    this.metadata.blockid=hash(genid);
  }

  if(!this.metadata.version){
    this.metadata.version=0;
  }

  if(initialdata){
    this.data=initialdata;
  }else{
    this.data={}
  }

}

exports.hash=hash;
exports.genid=genid;
exports.block=block;
