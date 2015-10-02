LSXParser.prototype.parseTextures = function(rootElement) {

  var texturesArray = rootElement.getElementsByTagName('TEXTURES');
  if (texturesArray === null || texturesArray.length !== 1) {
    return 'There must be one and only one TEXTURES.';
  }

  var texturesElement = texturesArray[0];

  this.graph.textures = {};

  var error;

  var texturesElements = texturesElement.children;
  for (var textureElementIndex = 0; textureElementIndex < texturesElements.length; ++textureElementIndex) {
    var textureElement = texturesElements[textureElementIndex];
    if (textureElement.nodeName !== 'TEXTURE') {
      return textureElement.nodeName + ' element is not valid under TEXTURES.';
    }

    if (textureElement.children.length != 2) {
      return 'There must be exactly 2 elements under a TEXTURE: file, amplif_factor';
    }

    // Get ID
    var id = this.reader.getString(textureElement, 'id');
    if (id == null) {
      return 'Invalid ID for TEXTURE.';
    }

    if (this.graph.textures.hasOwnProperty(id)) {
      return 'There already exists a MATERIAL with the id, ' + id;
    }

    this.graph.textures[id] = {};
    var texture = this.graph.textures[id];

    error = this.parseTexturesFile(texture, textureElement.getElementsByTagName('file'));
    if (error !== undefined)
      return error;
    error = this.parseTexturesAmplif_factor(texture, textureElement.getElementsByTagName('amplif_factor'));
    if (error !== undefined)
      return error;
  }
};

LSXParser.prototype.parseTexturesFile = function(texture, fileArray) {

  if (texture == null || fileArray == null || fileArray.length != 1) {
    return 'There must be one and only one fileArray in a TEXTURE';
  }

  var fileElement = fileArray[0];

  if (fileElement.attributes.length !== 1) {
    return 'file element must have exactly one attribute: path.';
  }

  texture.file = {};

  texture.file.path = this.reader.getString(fileElement, 'path');
  if (texture.file.path == null) {
    return 'Invalid path attribute for file, must be a string';
  }
};

LSXParser.prototype.parseTexturesAmplif_factor = function(texture, Amplif_factorArray) {
  if (texture == null || Amplif_factorArray == null || Amplif_factorArray.length != 1) {
    return 'There must be one and only one specular in a texture';
  }

  var Amplif_factorElement = Amplif_factorArray[0];

  if (Amplif_factorElement.attributes.length !== 2) {
    return 'amplif_factor element must have exactly 2 attributes: s, t.';
  }

  var error = this.getAttributesFloat(Amplif_factorElement, ['s', 't'], texture.amplifFactor = {});
  if (error != null) {
    return error;
  }
};

