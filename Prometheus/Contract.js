const Block = require('./Block.js');


var hash = Block.hash;
var genid=Block.genid;

var block={};

/*
  Initialize your program here.
  set the initial data, etc.
*/
var init=function(b){
  block=new Block.block(b.metadata,b.data);
}

var getblock=function(){
  return block;
}

var getdata=function(){
  return block.data;
}
var getmetadata=function(){
  return block.metadata;
}

var addrow = function(value){
  //add a new row to the block

  var rowid = genid();

  block.data[rowid]={
    version:hash(value),
    value:value
  }
  block.metadata.version=hash(hash(block.metadata.version)+hash(Object.keys(block.data)));
  return block.data[rowid];
}

var deleterow = function(rowid){
  //remove an existing row from the block
  if(block.data[rowid]){
    delete block.data[rowid];
    block.metadata.version=hash(hash(block.metadata.version)+hash(Object.keys(block.data)));

    return block.data;
  }else{
    return "Row "+rowid+" does not exist";
  }
}

var changerow = function(rowid,value){
  //change a row's value
  if(block.data[rowid]){
    var olddata=block.data[rowid];
    var newversion=hash(hash(olddata.version)+hash(value));

    block.data[rowid].version=newversion;
    block.data[rowid].value=value;


    return block.data[rowid];
  }else{

    return "Row "+rowid+" does not exist";
  }
}

exports.addrow=addrow;
exports.deleterow=deleterow;
exports.changerow=changerow;
exports.init=init;
exports.getdata=getdata;
exports.getmetadata=getmetadata;
exports.getblock=getblock;
