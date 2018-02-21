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
    this.metadata.blockid=hash(genid());
  }

  if(!this.metadata.version){
    this.metadata.version=0;
  }

  if(initialdata){
    this.data=initialdata;
  }else{
    this.data={}
  }
  this.addRow = function(value){
    //add a new row to the block

    var rowid = genid();

    this.data[rowid]={
      version:hash(value),
      value:value
    }
    this.metadata.version=hash(hash(this.metadata.version)+hash(Object.keys(this.data)));
    return this.data[rowid];
  }
  this.deleteRow=function(rowid){
    if(this.data[rowid]){
      delete this.data[rowid];
      this.metadata.version=hash(hash(this.metadata.version)+hash(Object.keys(this.data)));

      return this.data;
    }else{
      return "Row "+rowid+" does not exist";
    }
  }
  this.changeRow=function(rowid,value){
    if(this.data[rowid]){
      var olddata=this.data[rowid];
      var newversion=hash(hash(olddata.version)+hash(value));

      this.data[rowid].version=newversion;
      this.data[rowid].value=value;


      return this.data[rowid];
    }else{

      return "Row "+rowid+" does not exist";
    }
  }

}

exports.hash=hash;
exports.genid=genid;
exports.block=block;
