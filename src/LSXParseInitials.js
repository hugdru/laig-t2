LSXParser.prototype.parseInitials = function(rootElement) {
  this.graph.background = [1, 0, 0, 1];

  var initialsArray = rootElement.getElementsByTagName('INITIALS');
  if (initialsArray === null || initialsArray.length !== 1) {
    return 'There must be one and only one INITIALS';
  }

  var initials = initialsArray[0];

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
    return 'There must be one and only one frustum in INITIALS';

  var frustum = frustumArray[0];

  this.graph.initials.frustum = {};

  this.graph.initials.frustum.near = this.reader.getFloat(frustum, 'near');
  if (this.graph.initials.frustum.near === null || isNaN(this.graph.initials.frustum.near)) {
    return 'Frustum must have a near attribute with a numeric value';
  }

  this.graph.initials.frustum.far = this.reader.getFloat(frustum, 'far');
  if (this.graph.initials.frustum.far === null || isNaN(this.graph.initials.frustum.far)) {
    return 'Frustum must have a far attribute with a numeric value';
  }

};

LSXParser.prototype.parseInitialsTranslate = function(translateArray) {
  if (translateArray === null || translateArray.length !== 1)
    return 'There must be one and only one translate in INITIALS';

  var translate = translateArray[0];

  this.graph.initials.translate = {};

  var coordinates = 'xyz';

  for (var index in coordinates) {
    this.graph.initials.translate[coordinates[index]] = this.reader.getFloat(translate, coordinates[index]);

    if (this.graph.initials.translate[coordinates[index]] === null || isNaN(this.graph.initials.translate[coordinates[index]]))
      return 'Translate must have an ' + coordinates[index] + ' attribute with a numeric value';
  }
};

LSXParser.prototype.parseInitialsRotation = function(rotationArray) {
  if (rotationArray === null || rotationArray.length !== 3)
    return 'There must be one and only one rotation for each coordinate: x,y,z in INITIALS';

  this.graph.initials.rotation = {};

  var coordinates = ['x', 'y', 'z'];
  var isACoordinate = function(value) {
    if (value === coordinate)
      return true;
  };

  for (var rotationIndex = 0; rotationIndex < rotationArray.length; rotationIndex++) {
    var coordinate = this.reader.getString(rotationArray[rotationIndex], 'axis');

    var coordinateIndex = coordinates.findIndex(isACoordinate);

    if (coordinateIndex === -1)
      return 'Rotation must have an axis attribute with the value of x, y or z.';

    delete coordinates[coordinateIndex];

    this.graph.initials.rotation[coordinate] = this.reader.getFloat(rotationArray[rotationIndex], 'angle');

    if (this.graph.initials.rotation[coordinate] === null || isNaN(this.graph.initials.rotation[coordinate]))
      return 'Rotation must have an angle attribute with a numeric value';
  }
};

LSXParser.prototype.parseInitialsScale = function(scaleArray) {
  if (scaleArray === null || scaleArray.length !== 1)
    return 'There must be one and only one translate in INITIALS';

  var scale = scaleArray[0];

  this.graph.initials.scale = {};

  var coordinates = 'xyz';

  for (var index in coordinates) {
    this.graph.initials.scale[coordinates[index]] = this.reader.getFloat(scale, 's' + coordinates[index]);

    if (this.graph.initials.scale[coordinates[index]] === null || isNaN(this.graph.initials.scale[coordinates[index]]))
      return 'Scale must have a ' + coordinates[index] + ' attribute with a numeric value';
  }
};

LSXParser.prototype.parseInitialsReference = function(referenceArray) {
  if (referenceArray === null || referenceArray.length !== 1)
    return 'There must be one and only one translate in INITIALS';

  var reference = referenceArray[0];

  this.graph.initials.reference = this.reader.getFloat(reference, 'length');

  if (this.graph.initials.reference === null || isNaN(this.graph.initials.reference) || this.graph.initials.reference < 0)
    return 'Reference must have a length attribute with a numeric value >= 0';
};
