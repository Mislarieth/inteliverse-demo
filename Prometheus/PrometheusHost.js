const Hapi = require('hapi');
const server = new Hapi.Server();
const Block = require('./Block.js');
const rules = require('./Contract.js');



var metadata={
  blockid:"25kdksl",  //permanent id of the block
  version:"dklsl"     //DAG hash that is result of the hash of previous version with current keys
}

var data = {
  key1: {   //permanent ID of row
    version:"ad5k3l",   //DAG hash that is a result of the hash of the previous version with the present data
    value:"meow"    //current value that
  },
  key2: {
    version: "kd2ls",
    value:"hamster"
  },
  key3: {
    version: "k3k4d",
    value: "mreow"
  }
}


rules.init({
  metadata:metadata,
  data:data
});


var gencommit=function(request){

}


var processcommit=function(commit){
  commit={
    request:{
      function: "", //name of function being applied
      inputvars: {}, //all the vars required for function
    },
    signatures:{
      signers:[],//all the signers
      signedversion:[] //proof of signature, decrypt with asymetrical key provided in signers (map index to index) and it will equal version
    }
  }
}






server.connection({
    port: 8080
});

server.route({
  //literally just reply the data
  method: 'GET',
  path: '/invoke/getdata/',
  handler: function(request,reply){
    reply(rules.getdata())
  }
})

server.route({
  //literally just reply the metadata
  method: 'GET',
  path: '/invoke/getmetadata/',
  handler: function(request,reply){
    reply(rules.getmetadata())
  }
})

server.route({
    method: 'POST',
    path:'/invoke/addrow',
    handler: function (request, reply) {
        var result;
        var value = request.payload.value; //could be null

        if(!value){
          return reply("Please provide a value");
        }
        //TODO: generate commit to send out

        result=rules.addrow(value);

        reply(result);

    }
});

server.route({
    method: 'POST',
    path:'/invoke/deleterow',
    handler: function (request, reply) {
        var result;
        var rowid = request.payload.rowid; //could be null

        if(!rowid){
          return reply("Please provide a rowid");
        }
        //TODO: generate commit to send out
        result=rules.deleterow(rowid);
        reply(result);


    }
});

server.route({
    method: 'POST',
    path:'/invoke/changerow',
    handler: function (request, reply) {
        var result;
        var rowid = request.payload.rowid; //id of row to change value of
        var value = request.payload.value; //value to change row to

        if(!rowid){
          return reply("Please provide a rowid")
        }
        if(!value){
          return reply("Please provide a value")
        }

        //TODO: generate commit to send out

        result=rules.changerow(rowid,value);
        reply(result);


    }
});


server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
