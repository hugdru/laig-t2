function Cylinder(scene, amplifS, amplifT, height, bottomRadius, topRadius, slices, stacks) {
  CGFobject.call(this, scene);
  this.lateralFaces = new LateralFaces(scene, amplifS, amplifT, height, bottomRadius, topRadius, slices, stacks);
}

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.display = function() {
  this.lateralFaces.display();
}
