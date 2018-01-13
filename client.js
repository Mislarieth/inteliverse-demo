const axios = require('axios');
var crypto = require('crypto');

var presentblock={};
var pastblock={};


const hash = crypto.createHash('sha256');

/*
  hashes an object
*/
var hashit=function(obj){
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(obj));
  return hash.digest('hex');
}

var getPresentBlock=function(){
  return axios.get('http://192.168.1.17:8080');
}
var requestBlockChange=function(data){
  return axios.post('http://192.168.1.17:8080/changedata',data);
}

getPresentBlock().then(function(response){
  pastblock=presentblock;
  presentblock=response.data;
  console.log(presentblock);
}).then(function(){
  requestBlockChange({id:"GIVE ME DA MONEY"}).then(function(response){
    pastblock=presentblock;
    presentblock=response.data;
    if(presentblock.version!=hashit(pastblock)){
      console.log("Dude that's a false thing my man");
    }else{
      console.log("it was on the correct version; you're good my man");
    }
  })
});
