function Scene() {
  CGFscene.call(this);
}

Scene.prototype = Object.create(CGFscene.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.init = function(application) {
  CGFscene.prototype.init.call(this, application);

  this.initCameras();

  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);

  this.axis = new CGFaxis(this);
  this.enableTextures(true);

  this.triangle = new Triangle(this, 0, 0, [0, 1, 3], [0, 0, 3], [3, 0, 3]);
  this.rectangle = new Rectangle(this, 1, 1, [0, 2], [2, 0]);
  this.base = new Base(this, 0, 0, 20);
  this.cone = new Cylinder(this, 1, 1, 3, 2, 0, 20, 20);
  this.cylinder = new Cylinder(this, 1, 1, 1, 1, 1, 20, 20);
  this.sphere = new Sphere(this, 1, 1, 1, 20, 20);

  this.triangleAppearance = new CGFappearance(this);
  this.triangleAppearance.setAmbient(0.5, 0.5, 0.5, 1);
  this.triangleAppearance.setDiffuse(0.3, 0.3, 0.3, 1);
  this.triangleAppearance.setSpecular(0.15, 0.15, 0.15, 1);
  this.triangleAppearance.setShininess(2.5);
  this.triangleAppearance.loadTexture('../scenes/textures/floor.png');
  this.triangleAppearance.setTextureWrap('REPEAT', 'REPEAT');
};

Scene.prototype.initLights = function() {

  this.shader.bind();

  var index = 0;
  for (var lightName in this.graph.lights) {
    var light = this.graph.lights[lightName];

    this.lights[index].name = lightName;
    this.lights[index].turnIt = light.enabled;

    this.lights[index].setPosition(light.position.x, light.position.y, light.position.z, light.position.w);
    this.lights[index].setAmbient(light.ambient.r, light.ambient.g, light.ambient.b, light.ambient.a);
    this.lights[index].setDiffuse(light.diffuse.r, light.diffuse.g, light.diffuse.b, light.diffuse.a);
    this.lights[index].setSpecular(light.specular.r, light.specular.g, light.specular.b, light.specular.a);

    this.lights[index].name = lightName;

    if (this.lights[index].turnIt) {
      this.lights[index].enable();
      this.lights[index].setVisible(true);
    }

    //this.lights[index].setConstantAttenuation(1);
    //this.lights[index].setLinearAttenuation(1);
    //this.lights[index].setQuadraticAttenuation(0);

    ++index;
  }

  CGFlight.prototype.toggle = function() {
    if (this.turnIt) {
      this.enable();
    } else {
      this.disable();
    }
  };

  this.lights.filledLength = index;
  this.lightsCreated = true;

  this.shader.unbind();
};

Scene.prototype.updateLights = function() {
  for (i = 0; i < this.lights.filledLength; i++) {
    this.lights[i].update();
  }
};

Scene.prototype.initCameras = function() {
  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(20, 20, 20), vec3.fromValues(0, 0, 0));
};

Scene.prototype.setDefaultAppearance = function() {
  this.setAmbient(0.2, 0.4, 0.8, 1.0);
  this.setDiffuse(0.2, 0.4, 0.8, 1.0);
  this.setSpecular(0.2, 0.4, 0.8, 1.0);
  this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
Scene.prototype.onGraphLoaded = function() {
  /**** DEBUG ****/
  console.log(this.graph);
  console.log(this);
  /***************/

  this.gl.clearColor(this.graph.illumination.background.r, this.graph.illumination.background.g, this.graph.illumination.background.b, this.graph.illumination.background.a);

  this.initLights();
};

Scene.prototype.display = function() {
  // ---- BEGIN Background, camera and axis setup
  this.shader.bind();

  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  // Initialize Model-View matrix as identity (no transformation
  this.updateProjectionMatrix();
  this.loadIdentity();

  // Apply transformations corresponding to the camera position relative to the origin
  this.applyViewMatrix();

  // Draw axis
  this.axis.display();

  this.setDefaultAppearance();

  // ---- END Background, camera and axis setup

  // it is important that things depending on the proper loading of the graph
  // only get executed after the graph has loaded correctly.
  // This is one possible way to do it
  if (this.graph.isLoaded) {

    if (this.lightsCreated) {
      this.updateLights();
    }

    var root = this.graph.nodes.root;
    this.graph.display(root, root.material);
  }

  //this.triangleAppearance.apply();
  //this.pushMatrix();
  //this.scale(2, 2, 2);
  //this.sphere.display();
  //this.popMatrix();

  //this.pushMatrix();
  //this.translate(0, 0, 4);
  //this.cone.display();
  //this.translate(0, 0, 4);
  //this.cylinder.display();
  //this.popMatrix();

  //this.pushMatrix();
  //this.translate(4, 0, 0);
  //this.base.display();
  //this.triangle.display();
  //this.translate(1, 0, 0);
  //this.scale(2, 2, 2);
  //this.rectangle.display();
  //this.popMatrix();

  this.shader.unbind();
};
