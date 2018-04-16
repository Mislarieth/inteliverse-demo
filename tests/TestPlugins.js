var expect  = require("chai").expect;
const UniversalModel = require('../Prometheus/UniversalModel.js');
const WebSocket = require('ws');



describe('Plugin handler',function(){
  this.timeout(2000);
  var pluginHandler=new UniversalModel.PluginHandler();

  it('should handle adding and removing plugins',function(done){
    var plugin1 = new UniversalModel.Plugin();
    plugin1=pluginHandler.registerPlugin(plugin1);
    expect(typeof plugin1.id).to.equal('string');
    expect(pluginHandler.getPlugin(plugin1.id)).to.equal(plugin1);
    pluginHandler.removePlugin(plugin1.id);
    expect(pluginHandler.getPlugin(plugin1.id)).to.equal(undefined);
    done();
  })
  it('should handle plugin events',function(done){
    var address='127.0.0.1:8080';
    const ws = new WebSocket('ws://'+address);
    var wsplugin = new UniversalModel.wsPlugin(ws);
    pluginHandler.registerPlugin(wsplugin);
    wsplugin.sendMessage("meow");
    done();
  })

})
