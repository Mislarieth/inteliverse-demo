var crypto = require('crypto');
const Hapi = require('hapi');
const server = new Hapi.Server();


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

var processrequest=function(funky,inputvars){
  //do we have the function?
  if(rules[funky]){
    //insert into function
    inputvars=JSON.parse(inputvars);
    rules[funky](inputvars);
  }else{
    return "Function" + funky + "is not in the rules";
  }
}

var rules={};

var addrow = function(value){
  //add a new row to the block

  var rowid = genid();

  data[rowid]={
    version:hash(value),
    value:value
  }
  metadata.version=hash(hash(metadata.version)+hash(Object.keys(data)));
  return data[rowid];
}

var deleterow = function(rowid){
  //remove an existing row from the block
  if(data[rowid]){
    delete data[rowid];
    metadata.version=hash(hash(metadata.version)+hash(Object.keys(data)));

    return data;
  }else{
    return "Row "+rowid+" does not exist";
  }
}

var changerow = function(rowid,value){
  //change a row's value
  if(data[rowid]){
    var olddata=data[rowid];
    var newversion=hash(hash(olddata.version)+hash(value));

    data[rowid].version=newversion;
    data[rowid].value=value;


    return data[rowid];
  }else{

    return "Row "+rowid+" does not exist";
  }
}
rules.addrow=addrow;
rules.deleterow=deleterow;
rules.changerow=changerow;



server.connection({
    port: 8080
});

server.route({
  //literally just reply the data
  method: 'GET',
  path: '/invoke/getdata/',
  handler: function(request,reply){
    reply(data)
  }
})

server.route({
  //literally just reply the metadata
  method: 'GET',
  path: '/invoke/getmetadata/',
  handler: function(request,reply){
    reply(metadata)
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

        result=addrow(value);

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
        result=deleterow(rowid);
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

        result=changerow(rowid,value);
        reply(result);


    }
});

server.route({
  method: 'POST',
  path:'/invoke',
  handler:function(request,reply){
    var funky=request.payload.function;
    var inputvars=request.payload.inputvars;

  }
})

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
