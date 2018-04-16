function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
/*
  When incorporating alternative libraries, just create a plugin and a plugin handler
  Plugin will present event calls, plugin handler will interface libraries

*/


class PluginHandler{
	constructor(){
  	this.plugins={};
  }
  getPlugins(){
  	return this.plugins;
  }
  getPlugin(id){
  	return this.plugins[id];
  }
  registerPlugin(plug){
  	if(plug.id){
    	return false;
    }
  	if(plug instanceof Plugin){
      var id=generateUUID();
      plug.id=id;
      plug.pluginHandler=this;
      this.plugins[id]=plug;
      plug.init();
    }
		return plug;
  }
  removePlugin(id){
  	this.plugins[id].cleanup();
  	delete this.plugins[id];
  }

}


/*
  Base plugin class with empty skeleton functions

  *registered plugin will have
  	*id
    *whether or not it's running

*/
class Plugin{

	//this.id


  constructor(){
    this.running=false;
  }
	init(){
  	//on plugin registration
    this.running=true;

  }

  //on plugin removal
  cleanup(){
    this.running=false;
  }

}

class wsPlugin extends Plugin{

  constructor(ws){
    super();
    this.ws=ws;
  }

  init(){
    super.init();

  }
  cleanup(){
    super.cleanup();
  }

  onMessage(m){
    if(m instanceof Message){

    }else{
      return;
    }

  }
  sendMessage(m){
    if(m instanceof String){
      this.ws.send(m);
    }else{
      this.ws.send(JSON.stringify(m));
    }

  }
}

var pluginHandler = new PluginHandler();
var plugin = new Plugin(pluginHandler);
console.log(plugin);
plugin=pluginHandler.registerPlugin(plugin);
console.log(plugin);
if(plugin){
	//this means it's there and registered
  pluginHandler.removePlugin(plugin.id);
}




class Message{

  /*
    meta is for storing message-related data
      a.k.a. journey data
    data is for storing data

    data
    meta
        responseTo: *hash of message this message is in response to*
    signature
      sign(hash(hash(data)+hash(meta)),privateKey)

  */
  constructor(meta,data){
    this.meta=meta;
    this.data=data;
  }
}


/*
var ws={}
var pluginhandler=new wsPluginHandler(ws);
var responsePromises=new messageResponsePlugin();
pluginhandler.registerPlugin(responsePromises);
console.log(pluginhandler.getPlugins());
pluginhandler.removePlugin(responsePromises.id);
console.log(pluginhandler.getPlugins());*/

module.exports.PluginHandler=PluginHandler;
module.exports.Plugin=Plugin;
module.exports.wsPlugin=wsPlugin;
module.exports.Message=Message;
