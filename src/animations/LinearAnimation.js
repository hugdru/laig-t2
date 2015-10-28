function LinearAnimation(span) {
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