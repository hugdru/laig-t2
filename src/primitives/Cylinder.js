function Cylinder(scene, amplifS, amplifT, height, bottomRadius, topRadius, slices, stacks) {
  CGFobject.call(this, scene);
  this.lateralFaces = new LateralFaces(scene, amplifS, amplifT, height, bottomRadius, topRadius, slices, stacks);
  this.base = new Base(scene, amplifS, amplifT, slices);

  this.halfHeight = height / 2;
  this.bottomRadius = bottomRadius;
  this.topRadius = topRadius;
}

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.display = function() {
  this.lateralFaces.display();

  this.scene.pushMatrix();
    this.scene.translate(0, -this.halfHeight, 0);
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.scene.scale(this.bottomRadius, 0, this.bottomRadius);
    this.base.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(0, this.halfHeight, 0);
    this.scene.scale(this.topRadius, 0, this.topRadius);
    this.base.display();
  this.scene.popMatrix();
}
