LSXParser.prototype.parseInitials = function(rootElement) {

  var initialsArray = rootElement.getElementsByTagName('INITIALS');
  if (initialsArray === null || initialsArray.length !== 1)
    return 'There must be one and only one INITIALS.';

  var initials = initialsArray[0];

  if (initials.children.length !== 7)
    return 'INITIALS must have exactly seven children: frustum, translate, three rotation, scale and reference.';

  this.graph.initials = {};

  var error;

  error = this.parseInitialsFrustum(initials.getElementsByTagName('frustum'));
  if (error !== undefined)
    return error;

  error = this.parseInitialsTranslate(initials.getElementsByTagName('translate'));
  if (error !== undefined)
    return error;

  error = this.parseInitialsRotation(initials.getElementsByTagName('rotation'));
  if (error !== undefined)
    return error;

  error = this.parseInitialsScale(initials.getElementsByTagName('scale'));
  if (error !== undefined)
    return error;

  error = this.parseInitialsReference(initials.getElementsByTagName('reference'));
  if (error !== undefined)
    return error;
};

LSXParser.prototype.parseInitialsFrustum = function(frustumArray) {
  if (frustumArray === null || frustumArray.length !== 1)
    return 'There must be one and only one frustum in INITIALS.';

  var frustum = frustumArray[0];

  if (frustum.attributes.length !== 2)
    return 'frustum must have exactly two attributes: near and far.';

  this.graph.initials.frustum = {};

  this.graph.initials.frustum.near = this.reader.getFloat(frustum, 'near');
  if (this.graph.initials.frustum.near === null || isNaN(this.graph.initials.frustum.near))
    return 'frustum must have a near attribute with a numeric value.';

  this.graph.initials.frustum.far = this.reader.getFloat(frustum, 'far');
  if (this.graph.initials.frustum.far === null || isNaN(this.graph.initials.frustum.far))
    return 'frustum must have a far attribute with a numeric value.';
};

LSXParser.prototype.parseInitialsTranslate = function(translateArray) {
  if (translateArray === null || translateArray.length !== 1)
    return 'There must be one and only one translate in INITIALS.';

  var translate = translateArray[0];

  if (translate.attributes.length !== 3)
    return 'translate must have exactly three attributes: x, y, z.';

  var temp = this.getXYZ(translate);
  if (temp.constructor !== Array) {
    return temp;
  }
  this.graph.initials.translate = temp;
};

LSXParser.prototype.parseInitialsRotation = function(rotationArray) {
  if (rotationArray === null || rotationArray.length !== 3)
    return 'There must be one and only one rotation for each coordinate: x, y and z in INITIALS.';

  this.graph.initials.rotation = {};

  var coordinates = ['x', 'y', 'z'];
  var isACoordinate = function(value) {
    if (value === coordinate)
      return true;
  };

  for (var rotationIndex = 0; rotationIndex < rotationArray.length; rotationIndex++) {
    if (rotationArray[rotationIndex].attributes.length !== 2)
      return 'rotation must have exactly two attributes: axis and angle.';

    var coordinate = this.reader.getString(rotationArray[rotationIndex], 'axis');

    var coordinateIndex = coordinates.findIndex(isACoordinate);

    if (coordinateIndex === -1)
      return 'rotation must have an axis attribute with the value of x, y or z.';

    delete coordinates[coordinateIndex];

    this.graph.initials.rotation[coordinate] = this.reader.getFloat(rotationArray[rotationIndex], 'angle');

    if (this.graph.initials.rotation[coordinate] === null || isNaN(this.graph.initials.rotation[coordinate]))
      return 'rotation must have an angle attribute with a numeric value.';
  }
};

LSXParser.prototype.parseInitialsScale = function(scaleArray) {
  if (scaleArray === null || scaleArray.length !== 1)
    return 'There must be one and only one translate in INITIALS.';

  var scale = scaleArray[0];

  if (scale.attributes.length !== 3)
    return 'scale must have exactly three attributes: sx, sy, sz.';

  var temp = this.getSXYZ(scale);
  if (temp.constructor !== Array) {
    return temp;
  }
  this.graph.initials.scale = temp;
};

LSXParser.prototype.parseInitialsReference = function(referenceArray) {
  if (referenceArray === null || referenceArray.length !== 1)
    return 'There must be one and only one translate in INITIALS.';

  var reference = referenceArray[0];

  if (reference.attributes.length !== 1)
    return 'reference must have exactly one attribute: length.';

  this.graph.initials.reference = this.reader.getFloat(reference, 'length');

  if (this.graph.initials.reference === null || isNaN(this.graph.initials.reference) || this.graph.initials.reference < 0)
    return 'reference must have a length attribute with a numeric value >= 0.';
};
