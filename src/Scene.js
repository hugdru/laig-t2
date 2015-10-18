function Scene() {
  CGFscene.call(this);
}

Scene.prototype = Object.create(CGFscene.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.init = function(application) {
  CGFscene.prototype.init.call(this, application);

  this.initCameras();

  this.initLights();

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
  this.cone = new Cylinder(this, 0, 0, 3, 2, 0, 20, 20);
  this.cylinder = new Cylinder(this, 0, 0, 3, 2, 4, 20, 20);
  this.sphere = new Sphere(this, 0, 0, 1, 20, 20);

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

  this.lights[0].setPosition(2, 3, 3, 1);
  this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
  this.lights[0].update();

  this.shader.unbind();
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
  //DEBUG
  console.log(this.graph);

  this.gl.clearColor(this.graph.illumination.background.r, this.graph.illumination.background.g, this.graph.illumination
    .background.b, this.graph.illumination.background.a);
  this.lights[0].setVisible(true);
  this.lights[0].enable();
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
    this.lights[0].update();

    //var root = this.graph.nodes.root;
    //this.graph.display(root, root.material);
  }

  this.triangleAppearance.apply();
  this.pushMatrix();
    //this.scale(2, 2, 2);
    //this.sphere.display();
  this.popMatrix();

  this.pushMatrix();
    //this.translate(0, 0, 4);
    //this.cone.display();
    //this.translate(0, 0, 4);
    //this.cylinder.display();
  this.popMatrix();

  this.pushMatrix();
    //this.translate(4, 0, 0);
    //this.base.display();
    this.triangle.display();
    //this.translate(1, 0, 0);
    //this.scale(0.5, 0.5, 0.5);
    this.rectangle.display();
  this.popMatrix();

  this.shader.unbind();
};
