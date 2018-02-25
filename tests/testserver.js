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

  var block={};

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
    ws.on('message', function incoming(data) {
      var message = JSON.parse(data);
      if(message.type=="Acknowledgement"){
        expect(message.response).to.equal('Accepted Request');
        block.metadata=message.data;
        var m=JSON.stringify({type:"Action Request",action:{blockid:block.metadata.blockid,rulesfunction:"getdata",inputdata:[]}});
        ws.send(m)

      }else if(message.type=="Action Request Error"){
        var errormsg=message.data;
        console.log(errormsg);
      }else if(message.type=="Action Request Response"){
        var m=JSON.stringify({type:"Action Request",action:{blockid:block.metadata.blockid,rulesfunction:"getdata",inputdata:[]}});
        expect(message.meta.message).to.equal(Block.hash(m))
        block=new Block.block(block.metadata,message.data)
        done();
      }

    });
  })
  var r;
  it('should allow a client to add a row',function(done){
    var address='127.0.0.1:8080';
    const ws = new WebSocket('ws://'+address);
    var m;
    ws.on('message', function incoming(data) {
      var message = JSON.parse(data);
      if(message.type=="Acknowledgement"){
        expect(message.response).to.equal('Accepted Request');
        m=JSON.stringify({type:"Action Request",action:{blockid:block.metadata.blockid,rulesfunction:"addrow",inputdata:[5]}});
        ws.send(m)

      }else if(message.type=="Action Request Error"){
        var errormsg=message.data;
        console.log(errormsg);
      }else if(message.type=="Action Request Response"){
        expect(message.meta.message).to.equal(Block.hash(m));
      //  expect(message.data.value.value).to.equal(5);
        r =block.addRow(5);
        done();
      }

    });
  })
  it('should allow a client to edit a row',function(done){
    var address='127.0.0.1:8080';
    const ws = new WebSocket('ws://'+address);
    var m;
    ws.on('message', function incoming(data) {
      var message = JSON.parse(data);
      if(message.type=="Acknowledgement"){
        var blockmeta = message.data;
        expect(message.response).to.equal('Accepted Request');
        block.blockid=blockmeta.blockid;
        m=JSON.stringify({type:"Action Request",action:{blockid:block.blockid,rulesfunction:"setrow",inputdata:[r,5]}});
        ws.send(m)

      }else if(message.type=="Action Request Error"){
        var errormsg=message.data;
      }else if(message.type=="Action Request Response"){
        expect(message.meta.message).to.equal(Block.hash(m));
        expect(message.data.value).to.equal(5);
        done();
      }

    });
  })
  it('should allow a client to delete a row',function(done){
    var address='127.0.0.1:8080';
    const ws = new WebSocket('ws://'+address);
    var m;
    ws.on('message', function incoming(data) {
      var message = JSON.parse(data);
      if(message.type=="Acknowledgement"){
        var blockmeta = message.data;
        expect(message.response).to.equal('Accepted Request');
        block.blockid=blockmeta.blockid;
        m=JSON.stringify({type:"Action Request",action:{blockid:block.blockid,rulesfunction:"deleterow",inputdata:[r]}});
        ws.send(m)

      }else if(message.type=="Action Request Error"){
        var errormsg=message.data;
      }else if(message.type=="Action Request Response"){
        expect(message.meta.message).to.equal(Block.hash(m));
        expect(message.data).to.equal(true);
        done();
      }

    });
  })
})
