function Vehicle(scene) {

  this.scene = scene;
  CGFobject.call(this, scene);
  this.patch = new NURBSPatch(scene, 3, 50, 50,
      [
        [-1,-1,0,1],
        [-1,-0.5,0,1],
        [-1,0.5,0,1],
        [-1,1,0,1],

        [-1,-1,2,1],
        [-1,-0.5,2,1],
        [-1,0.5,2,1],
        [-1,1,2,1],

        [1,-1,-2,1],
        [1,-0.5,-2,1],
        [1,0.5,-2,1],
        [1,1,-2,1],

        [1,-1,0,1],
        [1,-0.5,0,1],
        [1,0.5,0,1],
        [1,1,0,1]
      ]
  );
}

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.display = function() {
  this.scene.pushMatrix();
  this.patch.display();
  this.scene.popMatrix();
};
