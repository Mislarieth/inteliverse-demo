var aiolos = require('./aiolos.js');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({
    port: 8080
});

var presentblock={};
var pastblock={};



server.route({
  method: 'GET',
  path: '/presentblock',
  handler: function(request,reply){
    reply(presentblock);
  }
})

server.route({
  method: 'GET',
  path: '/pastblock',
  handler: function(request,reply){
    reply(pastblock);
  }
})

server.route({
  method: 'POST',
  path: '/newblock',
  handler: function(request,reply){
    pastblock=presentblock;
    presentblock=aiolos.newblock(request.payload);
    reply(JSON.stringify(presentblock));
  }
})

server.route({
  method: 'POST',
  path: '/changeblock',
  handler: function(request,reply){
    pastblock=presentblock;
    presentblock=aiolos.changeblock(JSON.parse(request.payload.block),JSON.parse(request.payload.newdata));
    console.log(JSON.stringify(presentblock));
    reply(JSON.stringify(presentblock));
  }
})



server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
