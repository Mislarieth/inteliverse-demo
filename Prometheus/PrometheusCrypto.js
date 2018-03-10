const path = require("path");
const rsaWrapper = {};
const fs = require("fs");
const NodeRSA = require("node-rsa");
const crypto = require("crypto");
// open and closed keys generation method
rsaWrapper.generateRSA = () => {
  let key = new NodeRSA();
  // 2048 — key length, 65537 open exponent
  key.generateKeyPair(2048, 65537);
  //save keys as pem line in pkcs8
  var privatekey=key.exportKey("pkcs8-private-pem");
  var publickey=key.exportKey("pkcs8-public-pem");
  return [privatekey,publickey];
};

rsaWrapper.encrypt = (key, message) => {
    //is private
    if(key.indexOf("BEGIN PRIVATE KEY")==5){
      let enc = crypto.privateEncrypt({
      key: key,
      padding: crypto.RSA_PKCS1_OAEP_PADDING
      }, Buffer.from(message));
      return enc.toString("base64");
    }else if(key.indexOf("BEGIN PUBLIC KEY")==5){
      let enc = crypto.publicEncrypt({
      key: key,
      padding: crypto.RSA_PKCS1_OAEP_PADDING
      }, Buffer.from(message));
      return enc.toString("base64");
    }else{
      return false;
    }

};
// descrypting RSA, using padding OAEP, with nodejs crypto:
rsaWrapper.decrypt = (key, message) => {
  //is private
  if(key.indexOf("BEGIN PRIVATE KEY")==5){
    let enc = crypto.privateDecrypt({
    key: key,
    padding: crypto.RSA_PKCS1_OAEP_PADDING
  }, Buffer.from(message, "base64"));
    return enc.toString();
  }else if(key.indexOf("BEGIN PUBLIC KEY")==5){
    let enc = crypto.publicDecrypt({
    key: key,
    padding: crypto.RSA_PKCS1_OAEP_PADDING
  }, Buffer.from(message, "base64"));
    return enc.toString();
  }else{
    return false;
  }




};

rsaWrapper.signString=(stringtosign,privatekey)=>{
  var signer = crypto.createSign("RSA-SHA256");
  signer.update(stringtosign);
  var sign = signer.sign(privatekey, "hex");

 return sign;
};

rsaWrapper.verifySignedString=(originalstring,signedstring,publickey)=>{
  var verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(originalstring);
  var result = verifier.verify(publickey, signedstring, "hex");  

  return (result);
};




module.exports = rsaWrapper;
