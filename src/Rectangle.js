function Rectangle(scene, amplifS, amplifT, v1, v2) {
  CGFobject.call(this, scene);

  this.v1 = v1;
  this.v2 = v2;
  this.amplifS = amplifS;
  this.amplifT = amplifT;

  this.initBuffers();
  this.wireframe = false;
}

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.initBuffers = function() {

  this.vertices = [
    this.v1[0], this.v1[1], 0.0,
    this.v2[0], this.v1[1], 0.0,
    this.v1[0], this.v2[1], 0.0,
    this.v2[0], this.v2[1], 0.0
  ];

  var width = this.v2[0] - this.v1[0];
  var height = this.v2[1] - this.v1[1];

  this.normals = [
    // Front face
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0
  ];

  this.texCoords = [
    0.0, 1.0 * height / this.amplifT,
    1.0 * width / this.amplifS, 1.0 * height / this.amplifT,
    0.0, 0.0,
    1.0 * width / this.amplifS, 0.0
  ];

  this.indices = [
    0, 1, 2, 3
  ];

  this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
  this.initGLBuffers();

};

Rectangle.prototype.display = function() {
  this.drawElements(this.primitiveType);
};
