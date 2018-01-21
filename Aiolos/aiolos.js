var crypto = require('crypto');
const uuidv4 = require('uuid/v4');

const hash = crypto.createHash('sha256');


/*
Data model for a block is as follows:

        
        var data=[
          {hash1:key1},
          {hash2:key2},
          {hash3:key3},
          {hash4:key4},
          {hash5:key5},
          {hash6:key6},
          {hash7:key7},
          {hash8:key8},
          {hash9:key9},
          {hash10:key10},
          {hash11:key11},
          {hash12:key12},
          {hash13:key13},
          {hash14:key14}
        ];
        var blockhost={
          blockid="12kdksk3kkwsklsldkkfjdkslslk3klskcldf",
          hosts:{
              host:"host2dst9",
              branch1:{
                size:5, //how many keys does it involve? This adjusts to host's stake
                //covers [0-4]
                host:"hostkdhj2k5",
                branch1:{
                  size:3 //covers [0-2]
                  host:"hostkcnsn3j"
                },
                branch2:{
                  size:1, //covers [3]
                  host:"hostzxx72"
                }
              },
              branch2:{
                size:9, //larger stake, more responsibility
                //covers [5-13]
                host:"hostxmdsk",
                branch1:{
                  size:4, //covers [5-8]
                  host:"hostcd2k"
                },
                branch2:{
                  host:"hostkn3ksl",
                  size:5, //covers [9-13]
                  branch1:{
                    size:3  //covers [9-11]
                    host:"host7qaks",
                  },
                  branch2:{
                    size:2 //covers [12-13]
                    host:"hostv539k"

                  }
                }
              },
          }
        }

*/



/*
  hashes an object
*/
var hashit=function(obj){
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(obj));
  return hash.digest('hex');
}
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
    version:calcpresent(blockId,prev),
    data:d
  }
}

/*
    ---------changeblock---------
    block: the block to change
    newdata: the resulting new data you want it to hold

    returns the full object of the changed block
*/
var changeblock=function(block,newdata){
  var result={};
  result.blockid=block.blockid;
  //will return the hash of the block that you submitted
  result.version=hashit(block);
  result.data=newdata;
  return result;
}

exports.hashit=hashit;
exports.calcpresent=calcpresent;
exports.newblock=newblock;
exports.changeblock=changeblock;
