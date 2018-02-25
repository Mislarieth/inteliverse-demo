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
  return block.addRow(value);
}

var deleterow = function(rowid){
  //remove an existing row from the block
  return block.deleteRow(rowid);
}

var setrow = function(rowid,value){
  //change a row's value
   return block.setRow(rowid,value);
}

exports.addrow=addrow;
exports.deleterow=deleterow;
exports.setrow=setrow;
exports.init=init;
exports.getdata=getdata;
exports.getmetadata=getmetadata;
exports.getblock=getblock;
