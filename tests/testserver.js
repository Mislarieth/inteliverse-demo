var expect  = require("chai").expect;
var path = require('path');
var NodeRSA = require('node-rsa');
const WebSocket = require('ws');
const Block = require('../Prometheus/Block.js')


describe("Crypto",function(){
  var key = new NodeRSA({b: 512});
  it("can encrypt and decrypt messages",function(){

    //console.log(key);

    var text = 'Hello RSA!';
    var encrypted = key.encrypt(text, 'base64');
    var decrypted = key.decrypt(encrypted, 'utf8');
    expect(decrypted).to.equal(text);
  });
})

describe('Prometheus Real-Time',function(){


  it('should allow a client to connect to it',function(done){
    var address='127.0.0.1:8080';
    const ws = new WebSocket('ws://'+address);
    ws.on('message', function incoming(data) {
      var message = JSON.parse(data);
      if(message.type=="Acknowledgement"){
        expect(message.response).to.equal('Accepted Request');

        done();
      }

    });
  })
  it('should allow a client to make a request',function(done){
    var address='127.0.0.1:8080';
    const ws = new WebSocket('ws://'+address);
    var block={};
    ws.on('message', function incoming(data) {
      var message = JSON.parse(data);
      if(message.type=="Acknowledgement"){
        var blockmeta = message.data;
        expect(message.response).to.equal('Accepted Request');
        block.blockid=blockmeta.blockid;
        var m=JSON.stringify({type:"Action Request",action:{blockid:block.blockid,rulesfunction:"getdata",inputdata:{}}});
        ws.send(m)

      }else if(message.type=="Action Request Error"){
        var errormsg=message.data;
        console.log(errormsg);
      }else if(message.type=="Action Request Response"){
        var m=JSON.stringify({type:"Action Request",action:{blockid:block.blockid,rulesfunction:"getdata",inputdata:{}}});

        expect(message.meta.message).to.equal(Block.hash(m))
        console.log(message.data);
        done();
      }

    });
  })
})
