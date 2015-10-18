function Interface() {
  CGFinterface.call(this);
}

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

Interface.prototype.init = function(application) {

  CGFinterface.prototype.init.call(this, application);

  this.gui = new dat.GUI();

  // Lights check boxes
  var lightsGroup = this.gui.addFolder('Lights');
  lightsGroup.open();

  for (var lightIndex = 0; lightIndex < this.scene.lights.filledLength; ++lightIndex) {
    var light = this.scene.lights[lightIndex];
    lightsGroup.add(light, 'turnIt').name(light.name).onChange(light.toggle());
  }

  return true;
};

Interface.prototype.processKeyboard = function(event) {
  CGFinterface.prototype.processKeyboard.call(this, event);
};
