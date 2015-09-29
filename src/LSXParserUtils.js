LSXParser.prototype.getRGBA = function(domElement, graphElement) {
  var red = this.reader.getFloat(domElement, 'r');
  if (red === null || isNaN(red) || red < 0 || red > 1)
    return domElement.nodeName + 'must have a r attribute with a numeric value between 0 and 1.';

  var green = this.reader.getFloat(domElement, 'g');
  if (green === null || isNaN(green) || green < 0 || green > 1)
    return domElement.nodeName + 'must have a g attribute with a numeric value between 0 and 1.';

  var blue = this.reader.getFloat(domElement, 'b');
  if (blue === null || isNaN(blue) || blue < 0 || blue > 1)
    return domElement.nodeName + 'must have a b attribute with a numeric value between 0 and 1.';

  var alpha = this.reader.getFloat(domElement, 'a');
  if (alpha === null || isNaN(alpha) || alpha < 0 || alpha > 1)
    return domElement.nodeName + 'must have a a attribute with a numeric value between 0 and 1.';

  graphElement.rgba = [red, green, blue, alpha];
};
