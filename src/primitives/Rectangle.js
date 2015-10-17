function Rectangle(scene, amplifS, amplifT, v1, v2) {
  CGFobject.call(this, scene);

  this.plane = new Plane(scene, amplifS, amplifT, 15, v1, v2);
}

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.display = function() {
  this.plane.display();
};
