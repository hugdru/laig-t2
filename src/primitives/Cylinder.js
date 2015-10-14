function Cylinder(scene, amplifS, amplifT, height, bottomRadius, topRadius, stacks, slices) {
  CGFobject.call(this, scene);

  if (stacks == null || stacks < 1 || slices == null || slices < 3) {
    return 'A Cylinder has to have at least 1 stack and 3 slices.';
  }

  this.amplifS = amplifS;
  this.amplifT = amplifT;
  this.height = height;
  this.bottomRadius = bottomRadius;
  this.topRadius = topRadius;
  this.stacks = stacks;
  this.slices = slices;

  this.base = new Base(this.scene, this.amplifS, this.amplifT, this.slices);
  this.lateralFaces = new LateralFaces(this.scene, this.amplifS, this.amplifT, this.slices, this.stacks);
}

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.display = function() {
    // First Base
    this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.base.display();
    this.scene.popMatrix();

    // Second Base
    this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.base.display();
    this.scene.popMatrix();

    // Lateral Faces
    this.scene.pushMatrix();
        this.lateralFaces.display();
    this.scene.popMatrix();
};
