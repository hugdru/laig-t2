function Cylinder(scene, amplifS, amplifT, height, bottomRadius, topRadius, sectionsAlongHeight, partsPerSection) {
  CGFobject.call(this, scene);

  this.amplifS = amplifS;
  this.amplifT = amplifT;
  this.height = height;
  this.bottomRadius = bottomRadius;
  this.topRadius = topRadius;
  this.sectionsAlongHeight = sectionsAlongHeight;
  this.partsPerSection = partsPerSection;
}

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.initBuffers = function() {
};

Cylinder.prototype.display = function() {
  this.drawElements(this.primitiveType);
};
