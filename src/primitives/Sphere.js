function Sphere(scene, amplifS, amplifT, radius, tetaDivisions, phiDivisions) {
  CGFobject.call(this, scene);

  this.amplifS = amplifS;
  this.amplifT = amplifT;
  this.radius = radius;
  this.tetaDivisions = tetaDivisions;
  this.phiDivisions = phiDivisions;
}

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

Sphere.prototype.initBuffers = function() {
};

Sphere.prototype.display = function() {
  this.drawElements(this.primitiveType);
};
