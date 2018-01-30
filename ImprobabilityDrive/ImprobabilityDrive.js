var block={
  blockid:34,
  commits:[
    {
      message:{request:"add('a',4)"}, //base message requested
      hash:"3kldl" //hash of message
      signatures:[{host:"k3kxl",signature:"f06cbe0"},{host:"g3kml",signature:"k3lsj"}], //signatures are public ids of hosts who signed it and the encrypted hash of the message (with their private ID)
      requester:"2k3ls", //public id of the original sender of the message
      requestersignature:"kdl3kd" //signature of the hash of the message
    },
    {
      cmdk:{c:2},
      signatures:["k3kxl", "g2ksk"]
    }
  ],
  data:{
    a:1,
    b:2,
    c:3,
    d:4,
    e:5,
    hosts:["k3kxl","n3xsk","ask3k","g2ksk","mc23k"],
    signatures:["k3kxl","n3xsk","ask3k"]
  },
  commitforprevious:{
    c:2
  },
  add:function(){
    data[this.id]=data[this.id]+this.number;
  },
  get:function(){
    return data;
  }
}
var subscribedto=[
  {
    blockid:34,
    hostaccount:"n3xsk",
    hostip:"67.23.1.14:700"
  },
  {
    blockid:34,
    hostaccount:"g2ksk",
    hostip:"23.2.14.5:700"
  }
];

var blocknext={
  hosts=["252.168.253.234:9000","12.14.253.14:6863","2.23.25.55:3583"];
}
var blockprevious={
  hosts=["2.68.3.34:900","2.1.23.1:66","223.253.215.55:373","32.53.53.2"];
}

var blocks=[];
blocks.push(block);
var accountkey="k3kxl";


/*
  message={
    blockid:34,
    action:"add",
    variables:{id:a,number:5},
    sender:"ask3k",
    senderip:"34.65.75.74:400",
    signatures:["b3msk","3k2ls"] //how many hops it's made already
  }
*/
var blockrequest=function(message){
  blocks.foreach(function(b){
    if(message.blockid==b.blockid){
      if(b[message.action]){
        b[message.action].call(message.variables);
      }
    }else{
      blocknext.foreach(function(n){
        if(message.signatures){
          message.signatures.push(accountkey);
        }else{
          message.signatures=[accountkey];
        }
        request.post({url:n+"/blockrequest", form:message}, function(error, response, body){

          });
      })
    }
  })
}
