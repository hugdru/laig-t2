function Animation(scene) {
  if (scene == null) {
    return 'Animation was expecting valid arguments.';
  }
  this.scene = scene;
}

Animation.prototype.update = function() {
};
