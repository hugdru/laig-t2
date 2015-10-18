function Triangle(scene, amplifS, amplifT, v1, v2, v3) {
  CGFobject.call(this, scene);

  // Textures are wrong

  this.amplifS = amplifS;
  this.amplifT = amplifT;
  this.v1 = v1;
  this.v2 = v2;
  this.v3 = v3;

  this.a = Math.sqrt((v1[0] - v3[0]) * (v1[0] - v3[0]) +
    (v1[1] - v3[1]) * (v1[1] - v3[1]) +
    (v1[2] - v3[2]) * (v1[2] - v3[2]));

  this.b = Math.sqrt((v2[0] - v1[0]) * (v2[0] - v1[0]) +
    (v2[1] - v1[1]) * (v2[1] - v1[1]) +
    (v2[2] - v1[2]) * (v2[2] - v1[2]));

  this.c = Math.sqrt((v3[0] - v2[0]) * (v3[0] - v2[0]) +
    (v3[1] - v2[1]) * (v3[1] - v2[1]) +
    (v3[2] - v2[2]) * (v3[2] - v2[2]));

  this.cosAlpha = (-this.a * this.a + this.b * this.b + this.c * this.c) / (2 * this.b * this.c);
  this.cosBeta = (this.a * this.a - this.b * this.b + this.c * this.c) / (2 * this.a * this.c);
  this.cosGamma = (this.a * this.a + this.b * this.b - this.c * this.c) / (2 * this.a * this.b);

  this.beta = Math.acos(this.cosBeta);
  this.alpha = Math.acos(this.cosAlpha);
  this.gamma = Math.acos(this.cosGamma);
  this.sum = this.beta + this.alpha + this.gamma;
  // the sum of internal angles needs to be 180 or 3.14159
  // check this.sum to see that!

  this.initBuffers();
  this.wireframe = false;
}

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function() {

  this.vertices = [
    // Front face
    this.v1[0], this.v1[1], this.v1[2],
    this.v2[0], this.v2[1], this.v2[2],
    this.v3[0], this.v3[1], this.v3[2]

  ];

  var vector1 = [this.v3[0] - this.v2[0], this.v3[1] - this.v2[1], this.v3[2] - this.v2[2]];
  var vector2 = [this.v1[0] - this.v3[0], this.v1[1] - this.v3[1], this.v1[2] - this.v3[2]];

  var perpendicularVector = [
    vector1[1] * vector2[2] - vector2[1] * vector1[2],
    vector1[0] * vector2[2] - vector2[0] * vector1[2],
    vector1[0] * vector2[1] - vector2[0] * vector1[1]
  ];

  var perpendicularVectorNorm = Math.sqrt(Math.pow(perpendicularVector[0], 2) + Math.pow(perpendicularVector[1], 2) + Math.pow(perpendicularVector[2], 2));
  perpendicularVector = [perpendicularVector[0] / perpendicularVectorNorm, perpendicularVector[1] / perpendicularVectorNorm, perpendicularVector[2] / perpendicularVectorNorm];

  this.normals = [
    // Front face
    perpendicularVector[0], perpendicularVector[1], perpendicularVector[2],
    perpendicularVector[0], perpendicularVector[1], perpendicularVector[2],
    perpendicularVector[0], perpendicularVector[1], perpendicularVector[2]
  ];

  this.texCoords = [
    (this.c - this.a * Math.cos(this.beta)) / this.amplifS, 0.0,
    0.0, 1 / this.amplifT,
    this.c / this.amplifS, 1.0 / this.amplifT
  ];

  this.indices = [
    0, 1, 2
  ];

  this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
  this.initGLBuffers();
};

Triangle.prototype.display = function() {
  this.drawElements(this.primitiveType);
};
