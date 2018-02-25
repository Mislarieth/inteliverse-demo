const uuidv4 = require('uuid/v4');
var crypto = require('crypto');

/*
  hashes an object
*/
var hash=function(obj){
  obj=JSON.stringify(obj);
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
  /*
    returns the rowid of the new row
  */
  this.addRow = function(value){
    //add a new row to the block
    value=JSON.stringify(value);

    var rowid = genid();

    this.data[rowid]={
      version:hash(value),
      value:value
    }
    this.metadata.version=hash(hash(this.metadata.version)+hash(Object.keys(this.data)));
    return rowid;
  }
  this.deleteRow=function(rowid){
    if(!rowid){
      return "Failure: please provide a rowid";
    }
    if(this.data[rowid]){
      delete this.data[rowid];
      this.metadata.version=hash(hash(this.metadata.version)+hash(Object.keys(this.data)));
      return true;
    }else{
      return "Row "+rowid+" does not exist";
    }
  }
  this.setRow=function(rowid,value){
    if(!value){
      value=0;
    }
    if(!rowid){
      return "Failure: no rowid"
    }
    if(!this.data[rowid]){
      this.data[rowid]={
        version:hash(value),
        value:value
      };
    }
    var olddata=this.data[rowid];
    var newversion=hash(hash(olddata.version)+hash(value));

    this.data[rowid].version=newversion;
    this.data[rowid].value=value;

    return this.data[rowid];
  }

}

exports.hash=hash;
exports.genid=genid;
exports.block=block;
