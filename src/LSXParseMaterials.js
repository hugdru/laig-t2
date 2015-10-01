LSXParser.prototype.parseMaterials = function(rootElement) {

  var materialsArray = rootElement.getElementsByTagName('MATERIALS');
  if (materialsArray === null || materialsArray.length !== 1) {
    return 'There must be one and only one MATERIALS.';
  }

  var materialsElement = materialsArray[0];

  this.graph.materials = {};

  var error;

  var materialsElements = materialsElement.children;
  for (var materialElementIndex = 0; materialElementIndex < materialsElements.length; ++materialElementIndex) {
    var materialElement = materialsElements[materialElementIndex];
    if (materialElement.nodeName !== 'MATERIAL') {
      return materialElement.nodeName + ' element is not valid under MATERIALS.';
    }

    if (materialElement.children.length != 5) {
      return 'There must be exactly 5 elements under a MATERIAL: shininess, specular, diffuse, ambient, emission';
    }

    // Get ID
    var id = this.reader.getString(materialElement, 'id');
    if (id == null) {
      return 'Invalid ID for MATERIAL.';
    }

    if (this.graph.materials.hasOwnProperty(id)) {
      return 'There already exists a MATERIAL with the id, ' + id;
    }

    this.graph.materials[id] = {};
    var material = this.graph.materials[id];

    error = this.parseMaterialsShininess(material, materialElement.getElementsByTagName('shininess'));
    if (error !== undefined)
      return error;
    error = this.parseMaterialsSpecular(material, materialElement.getElementsByTagName('specular'));
    if (error !== undefined)
      return error;
    error = this.parseMaterialsDiffuse(material, materialElement.getElementsByTagName('diffuse'));
    if (error !== undefined)
      return error;
    error = this.parseMaterialsAmbient(material, materialElement.getElementsByTagName('ambient'));
    if (error !== undefined)
      return error;
    error = this.parseMaterialsEmission(material, materialElement.getElementsByTagName('emission'));
    if (error !== undefined)
      return error;
  }
};

LSXParser.prototype.parseMaterialsShininess = function(material, shininessArray) {

  if (material == null || shininessArray == null || shininessArray.length != 1) {
    return 'There must be one and only one shininess in a MATERIAL';
  }

  var shininessElement = shininessArray[0];

  if (shininessElement.attributes.length !== 1) {
    return 'shininess element must have exactly one attribute: value.';
  }

  material.shininess = this.reader.getFloat(shininessElement, 'value');
  if (material.shininess == null || isNaN(material.shininess)) {
    return 'Invalid value attribute for shininess, must be a number';
  }
};

LSXParser.prototype.parseMaterialsSpecular = function(material, specularArray) {
  if (material == null || specularArray == null || specularArray.length != 1) {
    return 'There must be one and only one specular in a material';
  }

  var specularElement = specularArray[0];

  if (specularElement.attributes.length !== 4) {
    return 'specular element must have exactly four attributes: r, g, b, a.';
  }

  material.specular = {};

  var error = this.getRGBA(specularElement, material.specular);
  if (error != null) {
    return error;
  }
};

LSXParser.prototype.parseMaterialsDiffuse = function(material, diffuseArray) {
  if (material == null || diffuseArray == null || diffuseArray.length != 1) {
    return 'There must be one and only one diffuse in a material';
  }

  var diffuseElement = diffuseArray[0];

  if (diffuseElement.attributes.length !== 4) {
    return 'difuse element must have exactly four attributes: r, g, b, a.';
  }

  material.diffuse = {};

  var error = this.getRGBA(diffuseElement, material.diffuse);
  if (error != null) {
    return error;
  }

};

LSXParser.prototype.parseMaterialsAmbient = function(material, ambientArray) {
  if (material == null || ambientArray == null || ambientArray.length != 1) {
    return 'There must be one and only one ambient in a material';
  }

  var ambientElement = ambientArray[0];

  if (ambientElement.attributes.length !== 4) {
    return 'ambient element must have exactly four attributes: r, g, b, a.';
  }

  material.ambient = {};

  var error = this.getRGBA(ambientElement, material.ambient);
  if (error != null) {
    return error;
  }
};

LSXParser.prototype.parseMaterialsEmission = function(material, emissionArray) {
  if (material == null || emissionArray == null || emissionArray.length != 1) {
    return 'There must be one and only one emission in a MATERIAL';
  }

  var emissionElement = emissionArray[0];

  if (emissionElement.attributes.length !== 4) {
    return 'emission element must have exactly four attributes: r, g, b, a.';
  }

  material.emission = {};

  var error = this.getRGBA(emissionElement, material.emission);
  if (error != null) {
    return error;
  }
};
