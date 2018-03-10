const baserules = require('./Contract.js');
const Block = require('./Block.js');

/*
  Initialize program here
*/
var init=function(b){
  baserules.init(b);


};


/*
  Our block is organized as follows:

    Handle  |  PublicID  |       IP:Port    |     SessionPass
   _______________________________________________________________


    George     dj3klsld    192.382.23.1:4848    k3llskd3jdk

    //username  publicid   hosting location  session-generated keypair
    //need publicID.privateKey to change sessionPass,
    //need sessionPass.privateKey to change Handle or IP:Port
*/

var connect=function(){

}

/*
  Person should be able to create an account
*/
var addAccount=function(handle,publicid,SessionPass, signature){
  //check to see if the variables exist, if not return error

  //check to make sure the publicid and handle is free

  //check to make sure the client knows the private keys of public and session
  //


  //add account to block
  //add new SessionPass
}

/*
  person should be able to change the value of the ip
  requires signature=encrypt(hash(SessionPass+this.ip) with SessionPass.privateKey)
*/
var setIP=function(handle,ip,signature){
  //check to see if they exist, if not return error


  //check signature to make sure that when you decrypt it using SessionPass
  //it equals the hash of SessionPass with my receiving IP:Port location
  //if not return error and start counter; too many and we'll add to block list


  //finally, set the IP at the handle to be the requested ip
  //assign new SessionPass
}

/*
exports.addrow=addrow;
exports.deleterow=deleterow;
exports.setrow=setrow;
exports.init=init;
exports.getdata=getdata;
exports.getmetadata=getmetadata;
exports.getblock=getblock;
*/
