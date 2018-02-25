const Hapi = require('hapi');
const Block = require('./Block.js');
const rules = require('./Contract.js');

const WebSocket = require('ws');






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

var generateBlock=function(){
  rules.init({
    metadata:false,
    data:false
  });
}
generateBlock();

const wss = new WebSocket.Server({ port: 8080 }, function(){
  console.log(`Listening to port 8080.`);
});

wss.on('connection', function connection(ws) {
//  console.log(ws);
  ws.on('message', function incoming(message) {
    var text=message;
    message=JSON.parse(message);
    /*
      message type is the language
    */
    if(message.type=="Action Request"){
      //don't have block
      if(message.action.blockid!=rules.getmetadata().blockid){
        ws.send(JSON.stringify({type:"Action Request Error",data:`The submitted block id ${message.action.blockid} is not located here. We do have ${rules.getmetadata().blockid}`}));
        ws.close();
      }else{
        //have the block

        //is requested rulesfuction in our rules?
        var response=rules[message.action.rulesfunction];
        if(response){
          var isArray=false;
          var repply;
          if(message.action.inputdata){
            if(Array.isArray(message.action.inputdata)){
              response=response.apply(null,message.action.inputdata);
              isArray=true;
            }else{
              ws.send(JSON.stringify({type:"Action Request Error",data:`The inputdata must be an array `}));
              ws.close();
              return;
            }

          }else{
            response=response();
          }
          if(isArray){
            var messaage=JSON.stringify({type:"Action Request Response",data:response,meta:{message:Block.hash(text)}});
            ws.send(messaage);
            ws.close();
          }
        }else{
          ws.send(JSON.stringify({type:"Action Request Error",data:`The requested function ${message.action.rulesfunction} is not located in ${rules.getmetadata().blockid}`}));
          ws.close();
        }
      }
    }
  });
  ws.send(JSON.stringify({type:"Acknowledgement",data:rules.getmetadata(),response:'Accepted Request'}));
});
