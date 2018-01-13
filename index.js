const Hapi = require('hapi');
const axios = require('axios');
var crypto = require('crypto');
const uuidv4 = require('uuid/v4');

/*axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
  .then(response => {
    reply(response.data.explanation);
    console.log(response.data.url);
    console.log(response.data.explanation);
  })
  .catch(error => {
    reply(error);
    console.log(error);
  });*/

const hash = crypto.createHash('sha256');

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

var changeablock=function(block,newdata){
  var result={};
  result.blockid=block.blockid;
  //will return the hash of the block that you submitted
  result.version=hashit(block);
  result.hosts=block.hosts;
  result.data=newdata;
  return result;
}

var presentblock={
  blockid:0,
  version:0,
  hosts:0,
  data:{}
};
var pastblock={
  blockid:0,
  hosts:0,
  data:{}
};


const server = new Hapi.Server();
server.connection({
    port: 8080
});




server.route({
  method: 'GET',
  path: '/',
  handler: function(request,reply){
    reply(presentblock);

  }
});

server.route({
    method: 'POST',
    path:'/changedata',
    handler: function (request, reply) {
      console.log(request.payload);
        var result=request.payload;
        pastblock=presentblock;
        presentblock=changeablock(pastblock,result);
        reply(presentblock);
        console.log("Past: "+JSON.stringify(pastblock));
        console.log("Present: "+JSON.stringify(presentblock));
    }
});

server.route({
    method: 'POST',
    path:'/whatversionami',
    handler: function (request, reply) {
      console.log(request.payload);
        var result=request.payload;


        reply(hashit(result));

    }
});

server.route({
  method: 'GET',
  path: '/users/{id}',
  handler: function(request,reply){
    reply(request.params.id)
  }
});


server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
    //presentblock=newblock({id:"newblock my dude"});
    axios.get('http://192.168.1.17:8080')
      .then(response => {
        pastblock=presentblock;
        console.log("Past: "+JSON.stringify(pastblock));
        console.log("Present: "+JSON.stringify(presentblock));
        axios.post('http://192.168.1.17:8080/changedata',{walrus:"mreow"})
          .then(response => {

            presentblock=response.data;

            console.log("Past hash: "+hashit(pastblock));
          })
          .catch(error => {
            console.log(error);
          });

      })
      .catch(error => {
        console.log(error);
      });
});















/*
var crypto = require('crypto');
var fs = require('fs');

var version=1;


fs.readFile('index.js', 'utf8', function(err, data) {
    if (err) throw err;
  //  version=data;
});


const sign = crypto.createSign('SHA256');
const verify = crypto.createVerify('SHA256');

sign.write('some data to sign');
sign.end();

const privateKey = crypto.randomBytes(32);
sign.sign(privateKey, 'hex');


var previous=1;
var data=0;
var next=0;
var encrypted=0;
var me=0;*/
