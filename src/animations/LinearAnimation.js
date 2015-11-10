function LinearAnimation(scene, span) {
  Animation.call(this, scene, span);
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.buildFunctions = function() {

  if (this.controlPoints[0].x !== 0 || this.controlPoints.y !== 0 || this.controlPoints.z !== 0) {
    this.controlPoints.splice(0, 0, {x:0, y:0, z:0});
  }

  this.stageLength = this.controlPoints.length - 1;
  if (this.stageLength < 1) {
    throw new Error('LinearAnimation, was expecting at least two controlPoints.');
  }

  this.eachStageSpan = this.span / this.stageLength;

  this.slopes = [];
  for (var stageIndex = 0; stageIndex < this.stageLength; ++stageIndex) {
    var slope = {};
    slope.x = (this.controlPoints[stageIndex + 1].x - this.controlPoints[stageIndex].x) / this.eachStageSpan;
    slope.y = (this.controlPoints[stageIndex + 1].y - this.controlPoints[stageIndex].y) / this.eachStageSpan;
    slope.z = (this.controlPoints[stageIndex + 1].z - this.controlPoints[stageIndex].z) / this.eachStageSpan;
    this.slopes.push(slope);
  }
};

LinearAnimation.prototype.updateTranslate = function(animationNode, deltaTime) {

  if (animationNode == null || deltaTime == null || deltaTime < 0) {
    throw new Error('updateTranslate, was expecting a animationNode and a valid deltaTime.');
  }

  animationNode.currentElapsedTime += deltaTime;

  var currentStage = Math.floor(animationNode.currentElapsedTime / this.span * this.stageLength);

  if (this.previousStage == null) {
    this.previousStage = this.currentStage;
  }

  if (currentStage > this.stageLength) {
    animationNode.translate.x = this.controlPoints[this.controlPoints.length - 1].x;
    animationNode.translate.y = this.controlPoints[this.controlPoints.length - 1].y;
    animationNode.translate.z = this.controlPoints[this.controlPoints.length - 1].z;
    return true;
  }

  if (this.previousStage === this.currentStage) {
    animationNode.translate.x += this.slopes[currentStage].x * deltaTime;
    animationNode.translate.y += this.slopes[currentStage].y * deltaTime;
    animationNode.translate.z += this.slopes[currentStage].z * deltaTime;
  } else {
    deltaTime = this.currentElapsedTime - currentStage * this.eachStageSpan;
    animationNode.translate.x = this.controlPoints[currentStage].x + this.slopes[currentStage].x * deltaTime;
    animationNode.translate.y = this.controlPoints[currentStage].y + this.slopes[currentStage].y * deltaTime;
    animationNode.translate.z = this.controlPoints[currentStage].z + this.slopes[currentStage].z * deltaTime;
  }

  animationNode.previousStage = currentStage;
};

LinearAnimation.prototype.resetTimes = function(animationNode) {

  Animation.prototype.resetTimes.call(this, animationNode);

  animationNode.currentElapsedTime = 0;
  animationNode.previousStage = null;
};
