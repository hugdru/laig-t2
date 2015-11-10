function Animation(scene, span) {

  if (scene == null || span == null || span <= 0) {
    throw new Error('Animation was expecting valid arguments.');
  }

  this.scene = scene;
  this.span = span * 1000;

  this.animationNodes = {};
}

Animation.prototype.update = function(currentTime) {

  var node = this.node;
  var animation = this.animation;

  var deltaTime = currentTime - node.previousTime;

  var doneTranslate = animation.updateTranslate.call(node, deltaTime);
  var doneRotate = animation.updateRotate.call(node, deltaTime);
  var scaleRotate = animation.updateScale.call(node, deltaTime);

  if (doneTranslate && doneRotate && scaleRotate) {
    animation.stop(node);
  }

  node.previousTime = currentTime;
};

Animation.prototype.buildFunctions = function() {
};

Animation.prototype.setDefaults = function(node) {

  this.animationNodes[node.id] = {};
  var animationNode = this.animationNodes[node.id];
  animationNode.translate = {x: 0, y: 0, z: 0};
  animationNode.rotate = {x: 0, y: 0, z: 0};
  animationNode.scale = {x: 1, y: 1, z: 1};

  animationNode.previousTime = 0;
  animationNode.elapsedTime = 0;
};

Animation.prototype.start = function(node, check) {

  if (check === undefined) {
    check = true;
  }

  if (check) {
    this.checkNode(node);
    this.createNodeAnimationIfNotExists(node);
  }

  this.setDefaults(node);
  var animationNode = this.animationNodes[node.id];
  animationNode.requestId = window.requestAnimationFrame(this.update);
};

Animation.prototype.runOnce = function(node) {

  this.checkNode(node);
  this.createNodeAnimationIfNotExists(node);
  var animationNode = this.animationNodes[node.id];
  if (!animationNode.ranOnce) {
    this.start(node, false);
    animationNode.ranOnce = true;
  }
};

Animation.prototype.associate = function(node, setDefault) {
  this.checkNode(node);

  if (setDefault === undefined) {
    setDefault = true;
  }
  this.createNodeAnimationIfNotExists(node, setDefault);
};

Animation.prototype.stop = function(node) {

  this.checkNode(node);

  var animationNode = this.animationNodes[node.id];
  if (animationNode == null) {
    return;
  }

  if (animationNode.requestId != null) {
    window.cancelAnimationFrame(animationNode.requestId);
    animationNode.requestId = null;
  }
};

Animation.prototype.updateTranslate = function(deltaTime) {
  return true;
};

Animation.prototype.updateRotate = function(deltaTime) {
  return true;
};

Animation.prototype.updateScale = function(deltaTime) {
  return true;
};

Animation.prototype.getTransformations = function(node) {

  this.checkNode(node);
  var animationNode = this.animationNodes[node.id];
  return {
    translate: animationNode.translate,
    rotate: animationNode.rotate,
    scale: animationNode.scale
  };

};

Animation.prototype.createNodeAnimationIfNotExists = function(node, setDefault) {

  if (setDefault === undefined) {
    setDefault = true;
  }
  if (!this.animationNodes.hasOwnProperty(node.id)) {
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

