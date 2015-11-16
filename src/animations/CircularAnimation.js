var degToRad = Math.PI / 180;

function CircularAnimation(scene, span, center, radius, startdegree, rotationDegree) {

  Animation.call(this, scene, span);

  if (center == null ||
      radius == null || radius <= 0 ||
      startdegree == null || rotationDegree == null
     ) {
    throw new Error('CircularAnimation expecting valid arguments');
  }

  this.center = vec3.fromValues(center.x, center.y, center.z);
  this.radius = radius;
  this.startAngle = degToRad * startdegree;
  this.rotationAngle = degToRad * rotationDegree;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.buildFunctions = function() {
  this.baseMatrix = mat4.create();
  mat4.identity(this.baseMatrix);
  mat4.rotateY(this.baseMatrix, this.baseMatrix, this.startAngle);
  mat4.translate(this.baseMatrix, this.baseMatrix, vec3.fromValues(this.radius, 0, 0));
};

CircularAnimation.prototype.updateMatrix = function(animationNode, deltaTime) {
  if (animationNode == null || deltaTime == null || deltaTime < 0) {
      throw new Error('updateMatrix, was expecting a animationNode and a valid deltaTime.');
  }

  animationNode.currentElapsedTime += deltaTime;
  animationNode.currentElapsedTime = Math.min(animationNode.currentElapsedTime, this.span);

  mat4.identity(animationNode.matrix);

  mat4.translate(animationNode.matrix, animationNode.matrix, this.center);

  mat4.rotateY(animationNode.matrix, animationNode.matrix, this.rotationAngle * (animationNode.currentElapsedTime / this.span));

  mat4.multiply(animationNode.matrix, animationNode.matrix, this.baseMatrix);

  if (animationNode.currentElapsedTime >= this.span) {
    return true;
  }
};

CircularAnimation.prototype.resetTimes = function(animationNode) {

  Animation.prototype.resetTimes.call(this, animationNode);

  animationNode.currentElapsedTime = 0;
};
