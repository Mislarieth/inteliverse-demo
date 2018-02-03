const uuidv4 = require('uuid/v4');
var crypto = require('crypto');

const hash = crypto.createHash('sha256');
var hashit=function(obj){
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(obj));
  return hash.digest('hex');
}

var block={
  data:{}//,
//  hosts:[],
//  commits:[]
}



var setData=function(d){
  block.data=d;
  return true;
}

var getData=function(){
  return block.data;
}

var getValueOfAccount=function(accountkey){
    return block.data[accountkey];
}
var addNewAccount=function(){
    var newkey=hashit(uuidv4());
    block.data[newkey]=0;
    return newkey;
}
var depositValueToAccount=function(accountkey,depositval){
  if(block.data[accountkey]){
    block.data[accountkey]+=depositval;
    return true;
  }else{
    return false;
  }

}
var withdrawValueFromAccount=function(accountkey,withdrawval){
  if(block.data[accountkey]){
    block.data[accountkey]-=withdrawval;
    return true;
  }else{
    return false;
  }
}

exports.setData=setData;
exports.getData=getData;
exports.getValueOfAccount=getValueOfAccount;
exports.addNewAccount=addNewAccount;
exports.depositValueToAccount=depositValueToAccount;
exports.withdrawValueFromAccount=withdrawValueFromAccount;
