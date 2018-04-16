var expect  = require("chai").expect;
var path = require('path');
var NodeRSA = require('node-rsa');
const WebSocket = require('ws');
const Block = require('../Prometheus/Block.js')
const cryptoprom=require('../Prometheus/PrometheusCrypto.js');



/*
describe("Crypto",function(){
  this.timeout(15000);
  var key = new NodeRSA({b: 512});
  it("can generate RSA keys",function(done){
    var keys=cryptoprom.generateRSA();
    expect(keys.length==2);
    done();
  });
  it("can encrypt with public and be decrypted with private",function(done){
    var keys=cryptoprom.generateRSA();
    var encrypted=cryptoprom.encrypt(keys[1],"meow");
    var decrypted=cryptoprom.decrypt(keys[0],encrypted);
    expect(decrypted).to.equal("meow");
    done();
  });
  it("can encrypt with private and be decrypted with public",function(done){
    var keys=cryptoprom.generateRSA();
    var encrypted=cryptoprom.encrypt(keys[0],"meow");
    var decrypted=cryptoprom.decrypt(keys[1],encrypted);
    expect(decrypted).to.equal("meow");
      done();
  });
  it("can sign with private and verify with public",function(done){
    var keys=cryptoprom.generateRSA();
    var stringtosign="HAMSTERDANCE";
    var signed=cryptoprom.signString(stringtosign,keys[0]);
    var verify=cryptoprom.verifySignedString(stringtosign,signed,keys[1]);
    expect(verify).to.equal(true);
      done();
  })
})*/

describe('Prometheus Real-Time',function(){
  this.timeout(2000);
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
  it('should allow a client to check ID',function(done){
      this.timeout(15000);
    var address='127.0.0.1:8080';
    const ws = new WebSocket('ws://'+address);
    var nonce=Block.genid();
    var publicID;
    ws.on('message', function incoming(data) {
      var message = JSON.parse(data);

      if(message.type=="Acknowledgement"){
        expect(message.response).to.equal('Accepted Request');
        var m=JSON.stringify({type:"Identity Request",nonce:nonce});
        publicID=message.publicID;
        ws.send(m);
      }else if(message.type=="Identity Response"){
        var verified=cryptoprom.verifySignedString(nonce,message.signature,publicID);
        expect(verified).to.equal(true);
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
        //expect the message's meta message hash to equal the hash of the message we sent
        var m=JSON.stringify({type:"Action Request",action:{blockid:block.metadata.blockid,rulesfunction:"getdata",inputdata:[]}});
        expect(message.meta.message).to.equal(Block.hash(m))
        block=new Block.block(block.metadata,message.data)
        done();
      }

    });
  })
  var r;
  var datatosend=5;
  it('should allow a client to add a row',function(done){
    var address='127.0.0.1:8080';
    const ws = new WebSocket('ws://'+address);
    var m;

    ws.on('message', function incoming(data) {
      var message = JSON.parse(data);
      if(message.type=="Acknowledgement"){
        expect(message.response).to.equal('Accepted Request');
        m=JSON.stringify({type:"Action Request",action:{blockid:block.metadata.blockid,rulesfunction:"addrow",inputdata:[datatosend]}});
        ws.send(m)

      }else if(message.type=="Action Request Error"){
        var errormsg=message.data;
        console.log(errormsg);
      }else if(message.type=="Action Request Response"){
        expect(message.meta.message).to.equal(Block.hash(m));
      //  expect(message.data.value.value).to.equal(5);
        r =block.setRow(message.data,datatosend);
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
        datatosend=25;
        m=JSON.stringify({type:"Action Request",action:{blockid:block.blockid,rulesfunction:"setrow",inputdata:[r,datatosend]}});
        ws.send(m)

      }else if(message.type=="Action Request Error"){
        var errormsg=message.data;
      }else if(message.type=="Action Request Response"){
        expect(message.meta.message).to.equal(Block.hash(m));
        expect(message.data.value).to.equal(datatosend);
        var k=block.setRow(r,datatosend);
        expect(k.version).to.equal(message.data.version);

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
        var k=block.deleteRow(r);
        expect(k).to.equal(true);
        done();
      }

    });
  })
  it('should print block',function(done){
    done();
    //console.log(block);


  })
})
