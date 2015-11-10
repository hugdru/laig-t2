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

LinearAnimation.prototype.updateTranslate = function(deltaTime) {

  if (this.currentElapsedTime > this.span) {
    return true;
  }

  if (this.previousElapsedTime === undefined) {
    this.previousElapsedTime = 0;
  }
  this.currentElapsedTime += deltaTime;

  var currentStage = Math.floor(this.currentElapsedTime / this.span * this.stageLength);
  if (this.previousStage === undefined) {
    this.previousStage = currentStage;
  }

  var previousTime = this.previousElapsedTime;
  for (var indexStage = this.previousStage; indexStage <= currentStage; ++indexStage) {

    var stageDeltaTime;
    if (this.previousStage === currentStage) {
      stageDeltaTime = deltaTime;
    } else if (indexStage === currentStage) {
      stageDeltaTime = this.currentElapsedTime - previousTime;
    } else {
      var timeStageFinished = (indexStage + 1) * this.eachStageSpan;
      stageDeltaTime = timeStageFinished - previousTime;
    }

    this.translate.x += slopes[indexStage].x * stageDeltaTime;
    this.translate.y += slopes[indexStage].y * stageDeltaTime;
    this.translate.z += slopes[indexStage].z * stageDeltaTime;

    previousTime = timeStageFinished;
  }

  this.previousStage = currentStage;
};
