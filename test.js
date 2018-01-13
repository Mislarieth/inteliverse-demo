const uuidv4 = require('uuid/v4');
var crypto = require('crypto');

var user1 = uuidv4();
const hash = crypto.createHash('sha256');
var hashit=function(obj){
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(obj));
  return hash.digest();
}
console.log(hashit("meow"));

/*
    ---------calcpresent---------
    id: the id of the block
    prev: the full previous object

    returns what you should get if you hash the blockid with the previous object
*/
var calcpresent=function(id,prev){
  var idstring=JSON.stringify(id);
  var prevstring=JSON.stringify(prev);
  var idhash=hashit(idstring);
  var prevhash=hashit(prevstring);
  return hashit(idhash+prevhash);
}

/*
    ---------newblock---------
    d: the data of the new block you wish to create

    note that a new block has a prev value of 0.

    returns the full object of the new block
*/
var newblock = function(d){
  var blockId=uuidv4();
  var prev=0;
  return {
    blockid:blockId,
    previous:prev,
    present:calcpresent(blockId,prev),
    data:d
  }
}

/*
    ---------changeblock---------
    prevblock: the entire previous state of the block
    newdata: the resulting new data you want it to hold

    returns the full object of the changed block
*/
var changeblock = function(prevblock, newdata){
  return {
    blockid:prevblock.blockid,
    previous:prevblock.present,
    present:calcpresent(prevblock.blockid,prevblock),
    data:newdata
  }
}


var result=newblock({hamster:"MREOW"});

console.log(result);
result=changeblock(result,{walrus:"WOW"});
console.log(result);

hash.end();
