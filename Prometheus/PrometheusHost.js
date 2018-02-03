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

//TODO: provide external loading of rules
//var contract = require('./Contract.js');

var metadata={
  blockid:"25kdksl",  //permanent id of the block
  version:"dklsl"     //DAG hash that is result of the hash of previous version with current keys
  //TODO: host data
  /*hosts:{
    hosts:["h2ksl3","dk3ls","hk3ls"],   //impermanent list of hosts
    hostlocations:["127.0.0.1:8080","127.0.0.1:8081","127.0.0.1:8082"]  //impermanent list of hosts' locations, index maps to index
  }*/
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

//TODO: commits
/*var commitdata={
  key1:[
    version:"5kskl3",
    request:{
      //holds all the data of a request object
      //used to verify that the request was properly made
      //also provides access to request variables and everything needed to authenticate request
      payload:{
        value:"jimmy"
      }
    }
    signatures: {
      hosts:["dk3ls","hk3ls"],
      signedversion:["n3lsk5","n3kls"]
    }
  ]
}*/



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
    //add a new row to the block
    method: 'POST',
    path:'/invoke/addrow',
    handler: function (request, reply) {
        var result;
        var value = request.payload.value; //could be null

        if(!value){
          return reply("Please provide a value");
        }
        //TODO: generate commit to send out

        var rowid = hash(Math.random());
        //rowid=JSON.stringify(rowid);

        data[rowid]={
          version:hash(value),
          value:value
        }
        metadata.version=hash(hash(metadata.version)+hash(Object.keys(data)));

        reply(data[rowid]);

    }
});

server.route({
    //remove and existing row from the block
    method: 'POST',
    path:'/invoke/deleterow',
    handler: function (request, reply) {
        var result;
        var rowid = request.payload.rowid; //could be null

        if(!rowid){
          return reply("Please provide a rowid");
        }
        //TODO: generate commit to send out

        if(data[rowid]){
          delete data[rowid];
          metadata.version=hash(hash(metadata.version)+hash(Object.keys(data)));

          reply(data);
        }else{
          reply("Row "+rowid+" does not exist");
        }


    }
});

server.route({
    //change a row's value
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

        //set the row value
        if(data[rowid]){
          var olddata=data[rowid];
          var newversion=hash(hash(olddata.version)+hash(value));

          data[rowid].version=newversion;
          data[rowid].value=value;


          reply(data[rowid]);
        }else{

          reply("Row "+rowid+" does not exist");
        }


    }
});

/*server.route({
  method: 'POST',
    path:'/invoke/{funcname}',
    handler: function (request, reply) {
      console.log(request.params.funcname);
        var variables=request.payload;
        if(variables){
          var keys=Object.keys(variables);



          var vars=[];
          for(key in keys){
            vars.push(variables[keys[key]]);
          }
          console.log(vars);
        }else{
          variables=[];
        }
        reply(contract[request.params.funcname].apply(null,Array.prototype.slice.call(variables,1)));

    }
})*/

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});


/*
var crypto = require('crypto');
const Hapi = require('hapi');
const server = new Hapi.Server();


var hash=function(obj){
  const hashbase = crypto.createHash('sha256');
  hashbase.update(JSON.stringify(obj));
  return hashbase.digest('hex');
}

var maptoobject=function(map){
  var dataobject={}
  map.forEach(function(key,value,m){
    console.log(key);
    console.log(value);
    dataobject[key]=value;
    console.log(dataobject);
  });
  return dataobject;
}

var objecttomap=function(object){
  var map=new Map();
  var keys=Object.keys(object);
  var key="";
  for(i in keys){
    key=keys[i];
    map.set(key,object[key]);
  }
  return map;
}


var metadata={
  blockid:"25kdksl",  //permanent id of the block
  version:"dklsl"     //DAG hash that is result of the hash of previous version with current keys
}

var data = new Map(); //map to hold data
data.set("key1", {  //permanent id of row
  version:"ad5k3l",   //DAG hash that is a result of the hash of the previous version with the present data
  value:"meow"    //current value that
});
data.set("key2",{
  version:"kd2ls",
  value:"hamster"
});
data.set("key3",{
  version: "k3k4d",
  value: "mreow"
});
console.log(data);




server.connection({
    port: 8080
});

server.route({
  //literally just reply the data
  method: 'GET',
  path: '/invoke/getdata/',
  handler: function(request,reply){
    reply(maptoobject(data));
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
    //add a new row to the block
    method: 'POST',
    path:'/invoke/addrow',
    handler: function (request, reply) {
        var result;
        var value = request.payload.value; //could be null

        if(!value){
          return reply("Please provide a value");
        }
        //TODO: generate commit to send out

        var rowid = hash(Math.random());

        data.set(rowid,{
          version:hash(value),
          value:value
        })
        metadata.version=hash(hash(metadata.version)+hash(data.keys()));

        reply(data.get(rowid));

    }
});

server.route({
    //remove and existing row from the block
    method: 'POST',
    path:'/invoke/deleterow',
    handler: function (request, reply) {
        var result;
        var rowid = request.payload.rowid; //could be null

        if(!rowid){
          return reply("Please provide a rowid");
        }
        //TODO: generate commit to send out

        if(data.get(rowid)){
          data.delete(rowid);
          metadata.version=hash(hash(metadata.version)+hash(data.keys()));

          reply(data);
        }else{
          reply("Row "+rowid+" does not exist");
        }


    }
});

server.route({
    //change a row's value
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

        //set the row value
        if(data.get(rowid)){
          var olddata=data.get(rowid);
          var newversion=hash(hash(olddata.version)+hash(value));

          var newobject={}
          newobject.version=newversion;
          newobject.value=value;
          data.set(rowid,newobject);


          reply(data.get(rowid));
        }else{

          reply("Row "+rowid+" does not exist");
        }


    }
});


server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
*/
