LSXParser.prototype.parseLights = function(rootElement) {

  var lightsArray = rootElement.getElementsByTagName('LIGHTS');
  if (lightsArray === null || lightsArray.length !== 1) {
    return 'There must be one and only one LIGHTS.';
  }

  var lights = lightsArray[0];

  this.graph.lights = [];

  var error;

  for (var lightIndex = 0; lightIndex < lights.length; ++lightIndex) {
    var lightElement = lights[lightIndex];
    if (light.nodeName !== 'light') {
      return lightElement.nodeName + ' element is not valid under LIGHTS.';
    }

    var tempLight = {};

    // Get ID
    tempLight.id = this.reader.getString(lightElement, 'id');
    if (tempLight.id == null) {
      return 'Ivalid ID for light.';
    }

    error = this.parseLightsEnable(tempLight, light.getElementsByTagName('enable'));
    if (error !== undefined)
      return error;
    error = this.parseLightsPosition(tempLight, light.getElementsByTagName('position'));
    if (error !== undefined)
      return error;
    error = this.parseLightsAmbient(tempLight, light.getElementsByTagName('ambient'));
    if (error !== undefined)
      return error;
    error = this.parseLightsDiffuse(tempLight, light.getElementsByTagName('diffuse'));
    if (error !== undefined)
      return error;
    error = this.parseLightsSpecular(tempLight, light.getElementsByTagName('specular'));
    if (error !== undefined)
      return error;

    this.graph.lights.push(tempLight);
  }
};

LSXParser.prototype.parseLightsEnable = function(tempLight, enableArray) {

  if (tempLight == null || enableArray == null || enableArray.length != 1) {
    return 'There must be only and only one enable in a light';
  }

  var enableElement = enableArray[0];

  tempLight.enabled = this.reader.getBoolean(enableElement, 'enabled');
  if (tempLight.enabled == null) {
    return 'Invalid value attribute for enable';
  }
};

LSXParser.prototype.parseLightsPosition = function(tempLight, positionArray) {};

LSXParser.prototype.parseLightsAmbient = function(tempLight, ambientArray) {
  if (tempLight == null || ambientArray == null || ambientArray.length != 1) {
    return 'There must be only and only one ambient in a light';
  }

  var ambientElement = ambientArray[0];

  if (var error = this.getRGBA(ambientElement, tempLight.ambient) != null) {
    return error;
  }
};

LSXParser.prototype.parseLightsDiffuse = function(tempLight, diffuseArray) {
  if (tempLight == null || diffuseArray == null || diffuseArray.length != 1) {
    return 'There must be only and only one diffuse in a light';
  }

  var difuseElement = difuseArray[0];

  if (var error = this.getRGBA(difuseElement, tempLight.diffuse) != null) {
    return error;
  }

};

LSXParser.prototype.parseLightsSpecular = function(tempLight, specularArray) {
  if (tempLight == null || specularArray == null || specularArray.length != 1) {
    return 'There must be only and only one specular in a light';
  }

  var specularElement = specularArray[0];

  if (var error = this.getRGBA(specularElement, tempLight.specular) != null) {
    return error;
  }
};
