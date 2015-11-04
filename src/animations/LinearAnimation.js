function LinearAnimation(scene, span) {

  Animation.call(this, scene);

  if (span == null) {
    return 'LinearAnimation was expecting valid arguments';
  }
  Animation.call(this);

  this.span = span;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function() {
};
