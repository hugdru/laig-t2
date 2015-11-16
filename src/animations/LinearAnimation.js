function LinearAnimation(scene, span) {
  Animation.call(this, scene, span);

  this.percentageStageTimeRotation = 0.20;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.buildFunctions = function() {

  if (this.controlPoints[0].x !== 0 || this.controlPoints[0].y !== 0 || this.controlPoints[0].z !== 0) {
    this.controlPoints.splice(0, 0, {x:0, y:0, z:0});
  }

  this.stageLength = this.controlPoints.length - 1;
  if (this.stageLength < 1) {
    throw new Error('LinearAnimation, was expecting at least two controlPoints.');
  }

  var distance = 0;
  this.positions = [];
  for (var stageIndex = 0; stageIndex < this.stageLength; ++stageIndex) {
    var vector = {};
    vector.x = this.controlPoints[stageIndex + 1].x - this.controlPoints[stageIndex].x;
    vector.y = this.controlPoints[stageIndex + 1].y - this.controlPoints[stageIndex].y;
    vector.z = this.controlPoints[stageIndex + 1].z - this.controlPoints[stageIndex].z;
    this.positions.push(vector);

    distance += this.norm(vector);
  }

  var velocity = distance / this.span;

  this.rotations = {}
  this.rotations[0] = 0;
  this.positionTimes = {};
  this.positionTimes[0] = 0;
  this.positionTimesDelta = {};

  for (stageIndex = 1; stageIndex < this.stageLength; ++stageIndex) {
    var timeStage = this.norm(this.positions[stageIndex]) / velocity;
    this.positionTimes[stageIndex] = this.positionTimes[stageIndex - 1] + timeStage;
    this.positionTimesDelta[stageIndex - 1] = this.positionTimes[stageIndex] - this.positionTimes[stageIndex - 1];

    var rotationStage = this.angleBetweenVectors(
      [this.positions[stageIndex - 1].x, this.positions[stageIndex - 1].z],
      [this.positions[stageIndex].x, this.positions[stageIndex].z]
    );
    this.rotations[stageIndex] = this.rotations[stageIndex - 1] + rotationStage;

    if (isNaN(this.rotations[stageIndex])) {
      this.rotations[stageIndex] = this.rotations[stageIndex] - 1;
    }
  }

  this.positionTimesDelta[stageIndex - 1] = this.span - this.positionTimes[stageIndex - 1];
};

LinearAnimation.prototype.updateMatrix = function(animationNode, deltaTime) {
  if (animationNode == null || deltaTime == null || deltaTime < 0) {
      throw new Error('updateMatrix, was expecting a animationNode and a valid deltaTime.');
  }

  animationNode.currentElapsedTime += deltaTime;
  animationNode.currentElapsedTime = Math.min(animationNode.currentElapsedTime, this.span);

  for (var currentStageIndex = (this.stageLength - 1); currentStageIndex > 0; --currentStageIndex) {
    if (this.positionTimes[currentStageIndex] < animationNode.currentElapsedTime) {
      break;
    }
  }

  /** Translation **/
  var translateRatio = (animationNode.currentElapsedTime - this.positionTimes[currentStageIndex]) / this.positionTimesDelta[currentStageIndex];
  animationNode.translate.x = this.controlPoints[currentStageIndex].x + this.positions[currentStageIndex].x * translateRatio;
  animationNode.translate.y = this.controlPoints[currentStageIndex].y + this.positions[currentStageIndex].y * translateRatio,
  animationNode.translate.z = this.controlPoints[currentStageIndex].z + this.positions[currentStageIndex].z * translateRatio;
  /** End of Translation **/

  /** Rotation **/
  if (currentStageIndex !== (this.stageLength - 1)) {
    var rotateTimeDelta = this.positionTimes[currentStageIndex + 1] - animationNode.currentElapsedTime;
    var intervalToRotate = this.percentageStageTimeRotation * this.positionTimesDelta[currentStageIndex];
    if (rotateTimeDelta < intervalToRotate) {
      var rotationDelta = this.rotations[currentStageIndex + 1] - this.rotations[currentStageIndex];
      var rotateRatio = (intervalToRotate - rotateTimeDelta) / intervalToRotate;
      animationNode.rotate.y = this.rotations[currentStageIndex] + rotationDelta * rotateRatio;
    } else {
      animationNode.rotate.y = this.rotations[currentStageIndex];
    }
  } else {
    animationNode.rotate.y = this.rotations[currentStageIndex];
  }
  /** End of Rotation **/

  if (animationNode.currentElapsedTime >= this.span) {
    return true;
  }
};

LinearAnimation.prototype.resetTimes = function(animationNode) {

  Animation.prototype.resetTimes.call(this, animationNode);

  animationNode.currentElapsedTime = 0;
};
