function Animation(scene, span) {

  if (scene == null || span == null || span <= 0) {
    throw new Error('Animation was expecting valid arguments.');
  }

  this.scene = scene;
  this.span = span * 1000;

  this.animationNodes = {};
}

Animation.prototype.update = function(currentUpdateTime) {

  var self = this;

  var disableUpdate = true;
  if (this.previousUpdateTime == null) {
    this.previousUpdateTime = currentUpdateTime;
    this.requestId = requestAnimationFrame(function() {
      self.update(performance.now());
    });
    return;
  }

  var deltaTime = currentUpdateTime - this.previousUpdateTime;

  for (var property in this.animationNodes) {

    animationNode = this.animationNodes[property];
    if (animationNode.done) {
      continue;
    }

    var translateDone = this.updateTranslate(animationNode, deltaTime);
    var rotateDone = this.updateRotate(animationNode, deltaTime);
    var scaleDone = this.updateScale(animationNode, deltaTime);

    var allDone = translateDone && rotateDone && scaleDone;
    if (allDone) {
      animationNode.done = true;
      this.resetTimes(animationNode);
    }

    disableUpdate = disableUpdate && allDone;

    this.previousUpdateTime = currentUpdateTime;
  }

  if (disableUpdate) {
    this.requestId = null;
    this.previousUpdateTime = null;
  } else {
    this.requestId = requestAnimationFrame(function() {
      self.update(performance.now());
    });
  }

};

Animation.prototype.buildFunctions = function() {};

Animation.prototype.run = function(node) {
  this.checkNode(node);
  this.createNodeAnimationIfNotExists(node);
  this.animationNodes[node.id].done = false;
  this.update();
};

Animation.prototype.runOnce = function(node) {
  this.checkNode(node);
  var created = this.createNodeAnimationIfNotExists(node);
  if (created) {
    this.update();
  }
};

Animation.prototype.updateTranslate = function(animationNode, deltaTime) {
  return true;
};

Animation.prototype.updateRotate = function(animationNode, deltaTime) {
  return true;
};

Animation.prototype.updateScale = function(animationNode, deltaTime) {
  return true;
};

Animation.prototype.getTransformations = function(node) {

  this.checkNode(node);
  var animationNode = this.animationNodes[node.id];
  if (animationNode !== null) {
    return {
      translate: animationNode.translate,
      rotate: animationNode.rotate,
      scale: animationNode.scale
    };
  }

};

Animation.prototype.setDefaults = function(node) {

  this.animationNodes[node.id] = {};
  var animationNode = this.animationNodes[node.id];
  animationNode.translate = {
    x: 0,
    y: 0,
    z: 0
  };
  animationNode.rotate = {
    x: 0,
    y: 0,
    z: 0
  };
  animationNode.scale = {
    x: 1,
    y: 1,
    z: 1
  };

  animationNode.previousElapsedTime = 0;
  animationNode.currentElapsedTime = 0;
};


Animation.prototype.createNodeAnimationIfNotExists = function(node, setDefault) {

  if (!this.animationNodes.hasOwnProperty(node.id)) {
    if (setDefault === undefined) {
      setDefault = true;
    }
    if (setDefault) {
      this.setDefaults(node);
    }
    return true;
  }
  return false;
};

Animation.prototype.checkNode = function(node) {
  if (node == null || node.id == null) {
    throw new Error('Animation, checkNode must received a node as argument');
  }
};

Animation.prototype.resetTimes = function(animationNode) {
  if (animationNode == null) {
    throw new Error('Animation, resetTimes must received a animationNode as argument.');
  }
};
