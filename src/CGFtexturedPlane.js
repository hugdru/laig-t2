function CGFtexturedPlane(scene, textureUrl, amplifS, amplifT, v1, v2) {
  CGFobject.call(this, scene);

  this.v1 = v1;
  this.v2 = v2;
  this.amplifS = amplifS;
  this.amplifT = amplifT;
  this.appearance = new CGFappearance(this.scene);
  this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
  this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
  this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
  this.appearance.setShininess(120);
  if (textureUrl != null) {
    this.texture = new CGFtexture(scene, textureUrl);
    this.appearance.setTexture(this.texture);
    this.appearance.setTextureWrap('REPEAT', 'REPEAT');
  }
  this.initBuffers();
  this.wireframe = false;
}

CGFtexturedPlane.prototype = Object.create(CGFobject.prototype);
CGFtexturedPlane.prototype.constructor = CGFtexturedPlane;

/**
 * @private
 */
CGFtexturedPlane.prototype.initBuffers = function() {

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

/**
 *
 * @param shader {CGFshader} (must be applied)
 * @param mvMatrix {mat4}
 */
CGFtexturedPlane.prototype.display = function() {

  this.scene.pushMatrix();
  this.appearance.apply();
  this.drawElements(this.primitiveType);
  this.scene.popMatrix();
};
