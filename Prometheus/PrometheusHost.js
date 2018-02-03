const Hapi = require('hapi');
const server = new Hapi.Server();

var contract = require('./Contract.js');




server.connection({
    port: 8080
});


server.route({
  method: 'POST',
    path:'/invoke/{funcname}',
    handler: function (request, reply) {
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
})

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
