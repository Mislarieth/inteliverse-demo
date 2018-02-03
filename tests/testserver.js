var expect  = require("chai").expect;
var request = require("request");
var path = require('path');
var aiolos = require(path.join(__dirname, '..','Aiolos','aiolos.js'));
var ipaddress;
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  ipaddress=add;
})



describe('Aiolos', function() {
  it('should consistently hash an object',function(){
    var stringy="hamster";
    var stringyhash1=aiolos.hashit(stringy);
    var stringyhash2=aiolos.hashit(stringyhash1);
    var stringyhash3=aiolos.hashit(stringyhash2);

    expect(stringyhash3).to.equal(aiolos.hashit(aiolos.hashit(aiolos.hashit(stringy))));
  });
  it('should be able to tell you the history of the object by comparing the hash of the (i-1)th block to the version of the i-th block ',function(){
    var blockv1 = aiolos.newblock({id:"first"});
    var blockv2 = aiolos.changeblock(blockv1, {id:"first"});
    var blockv3 = aiolos.changeblock(blockv2,{id:"first"});

    expect(aiolos.hashit(blockv1)).to.equal(blockv2.version);
    expect(aiolos.hashit(blockv2)).to.equal(blockv3.version);
    expect(aiolos.hashit(blockv1)).to.not.equal(blockv3.version);

  });

});

describe('Aiolos Host',function(){
  var url="http://127.0.1.1:8080/";
  var presentblock={};
  var pastblock={};
  it('should be able to create a new data block',function(done){
    request.post({url:url+"newblock", form:{
        id: "first"
      }}, function(error, response, body){
        presentblock=JSON.parse(body);
        expect(response.statusCode).to.equal(200);
        expect(typeof presentblock).to.not.equal('undefined');
        done();
      });
  });
  it('should tell you the present public block',function(done){
    request(url+"presentblock",function(error, response, body){
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal(JSON.stringify(presentblock));
      done();
    })
  });
  /*it('should be able to pull a new data block',function(done){
    request(url,function(error, response, body){
      expect(1).to.equal(0);
      done();
    })
  });*/
  it('should allow for users to change the data',function(done){
    var nudata={id:'fuqdapolice'};
    request.post({url:url+"changeblock", form:{
        block: JSON.stringify(presentblock),
        newdata: JSON.stringify(nudata)
      }}, function(error, response, body){
        pastblock=presentblock;
        presentblock=JSON.parse(body);
        expect(response.statusCode).to.equal(200);
        expect(aiolos.hashit(presentblock)).to.equal(aiolos.hashit(aiolos.changeblock(pastblock,nudata)));
        done();
      });
  });

});
