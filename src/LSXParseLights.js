LSXParser.prototype.parseLights = function(rootElement) {

  var lightsArray = rootElement.getElementsByTagName('LIGHTS');
  if (lightsArray === null || lightsArray.length !== 1) {
    return 'There must be one and only one LIGHTS.';
  }

  var lightsElement = lightsArray[0];

  this.graph.lights = {};

  var error;

  var lightsElements = lightsElement.children;
  for (var lightElementIndex = 0; lightElementIndex < lightsElements.length; ++lightElementIndex) {
    var lightElement = lightsElements[lightElementIndex];
    if (lightElement.nodeName !== 'LIGHT') {
      return lightElement.nodeName + ' element is not valid under LIGHTS.';
    }

    if (lightElement.children.length != 5) {
      return 'There must be exactly 5 elements under a LIGHT: enable, position, ambient, diffuse, specular';
    }

    // Get ID
    var id = this.reader.getString(lightElement, 'id');
    if (id == null) {
      return 'Invalid ID for light.';
    }

    if (this.graph.lights.hasOwnProperty(id)) {
      return 'There already exists a LIGHT with the id, ' + id;
    }

    this.graph.lights[id] = {};
    var light = this.graph.lights[id];

    error = this.parseLightsEnable(light, lightElement.getElementsByTagName('enable'));
    if (error !== undefined)
      return error;
    error = this.parseLightsPosition(light, lightElement.getElementsByTagName('position'));
    if (error !== undefined)
      return error;
    error = this.parseLightsAmbient(light, lightElement.getElementsByTagName('ambient'));
    if (error !== undefined)
      return error;
    error = this.parseLightsDiffuse(light, lightElement.getElementsByTagName('diffuse'));
    if (error !== undefined)
      return error;
    error = this.parseLightsSpecular(light, lightElement.getElementsByTagName('specular'));
    if (error !== undefined)
      return error;
  }
};

LSXParser.prototype.parseLightsEnable = function(light, enableArray) {

  if (light == null || enableArray == null || enableArray.length != 1) {
    return 'There must be one and only one enable in a light';
  }

  var enableElement = enableArray[0];

  if (enableElement.attributes.length !== 1) {
    return 'enable element must have exactly one attribute: value.';
  }

  light.enabled = this.reader.getBoolean(enableElement, 'value');
  if (light.enabled == null) {
    return 'Invalid value attribute for enable';
  }
};

LSXParser.prototype.parseLightsPosition = function(light, positionArray) {

  if (light == null || positionArray == null || positionArray.length !== 1) {
    return 'There must be one and only one position element in a light.';
  }

  var positionElement = positionArray[0];

  if (positionElement.attributes.length !== 4) {
    return 'position element must have exactly four attributes: x, y, z, w.';
  }

  var x = this.reader.getFloat(positionElement, 'x');
  if (x === null || isNaN(x))
    return positionElement.nodeName + ' element must have a x attribute with a numeric value.';

  var y = this.reader.getFloat(positionElement, 'y');
  if (y === null || isNaN(y))
    return positionElement.nodeName + ' element must have a y attribute with a numeric value.';

  var z = this.reader.getFloat(positionElement, 'z');
  if (z === null || isNaN(z))
    return positionElement.nodeName + ' element must have a z attribute with a numeric value.';

  var w = this.reader.getFloat(positionElement, 'w');
  if (w === null || isNaN(w))
    return positionElement.nodeName + ' element must have a w attribute with a numeric value.';

  light.position = [x, y, z, w];

};

LSXParser.prototype.parseLightsAmbient = function(light, ambientArray) {
  if (light == null || ambientArray == null || ambientArray.length != 1) {
    return 'There must be only and only one ambient in a light';
  }

  var ambientElement = ambientArray[0];

  if (ambientElement.attributes.length !== 4) {
    return 'ambient element must have exactly four attributes: r, g, b, a.';
  }

  light.ambient = {};

  var error = this.getRGBA(ambientElement, light.ambient);
  if (error != null) {
    return error;
  }
};

LSXParser.prototype.parseLightsDiffuse = function(light, diffuseArray) {
  if (light == null || diffuseArray == null || diffuseArray.length != 1) {
    return 'There must be only and only one diffuse in a light';
  }

  var diffuseElement = diffuseArray[0];

  if (diffuseElement.attributes.length !== 4) {
    return 'difuse element must have exactly four attributes: r, g, b, a.';
  }

  light.diffuse = {};

  var error = this.getRGBA(diffuseElement, light.diffuse);
  if (error != null) {
    return error;
  }

};

LSXParser.prototype.parseLightsSpecular = function(light, specularArray) {
  if (light == null || specularArray == null || specularArray.length != 1) {
    return 'There must be only and only one specular in a light';
  }

  var specularElement = specularArray[0];

  if (specularElement.attributes.length !== 4) {
    return 'specular element must have exactly four attributes: r, g, b, a.';
  }

  light.specular = {};

  var error = this.getRGBA(specularElement, light.specular);
  if (error != null) {
    return error;
  }
};
