function LinearAnimation(scene, span) {
  Animation.call(this, scene, span);
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.buildFunctions = function() {

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

  if (animationNode.currentElapsedTime > this.span) {
    return true;
  }

  if (animationNode.previousElapsedTime == null) {
    animationNode.previousElapsedTime = 0;
  }
  animationNode.currentElapsedTime += deltaTime;

  var currentStage = Math.floor(animationNode.currentElapsedTime / this.span * this.stageLength);
  if (animationNode.previousStage == null) {
    animationNode.previousStage = currentStage;
  }

  var previousTime = animationNode.previousElapsedTime;
  for (var indexStage = animationNode.previousStage; indexStage <= currentStage; ++indexStage) {

    var timeStageFinished;
    var stageDeltaTime;
    if (animationNode.previousStage === currentStage) {
      stageDeltaTime = deltaTime;
    } else if (indexStage === currentStage) {
      stageDeltaTime = animationNode.currentElapsedTime - previousTime;
    } else {
      timeStageFinished = (indexStage + 1) * animationNode.eachStageSpan;
      stageDeltaTime = timeStageFinished - previousTime;
    }

    animationNode.translate.x += this.slopes[indexStage].x * stageDeltaTime;
    animationNode.translate.y += this.slopes[indexStage].y * stageDeltaTime;
    animationNode.translate.z += this.slopes[indexStage].z * stageDeltaTime;

    if (animationNode.previousStage !== currentStage) {
      previousTime = timeStageFinished;
    }
  }

  animationNode.previousStage = currentStage;
};

LinearAnimation.prototype.resetTimes = function(animationNode) {

  Animation.prototype.resetTimes.call(this, animationNode);

  animationNode.previousElapsedTime = null;
};
