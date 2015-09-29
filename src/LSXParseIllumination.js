LSXParser.prototype.parseIllumination = function(rootElement) {
  var illuminationArray = rootElement.getElementsByTagName('ILLUMINATION');
  if (illuminationArray === null || illuminationArray.length !== 1) {
    return 'There must be one and only one ILLUMINATION.';
  }

  var illumination = illuminationArray[0];

  this.graph.illumination = {};

  var error;

  error = this.parseIlluminationAmbient(illumination.getElementsByTagName('ambient'));
  if (error !== undefined)
    return error;

  error = this.parseIlluminationDoubleside(illumination.getElementsByTagName('doubleside'));
  if (error !== undefined)
    return error;

  error = this.parseIlluminationBackground(illumination.getElementsByTagName('background'));
  if (error !== undefined)
    return error;
};

LSXParser.prototype.parseIlluminationAmbient = function(ambientArray) {
  if (ambientArray === null || ambientArray.length !== 1)
    return 'There must be one and only one ambient in ILLUMINATION.';

  var ambient = ambientArray[0];

  if (ambient.attributes.length !== 4)
    return 'Ambient must have exactly four attributes: r, g, b and a.';

  this.graph.illumination.ambient = {};

  var error = this.getRGBA(ambient, this.graph.illumination.ambient);

  if (error !== undefined)
    return error;

};

LSXParser.prototype.parseIlluminationDoubleside = function(doublesideArray) {
  if (doublesideArray === null || doublesideArray.length !== 1)
    return 'There must be one and only one doubleside in ILLUMINATION.';

  var doubleside = doublesideArray[0];

  if (doubleside.attributes.length !== 1)
    return 'Doubleside must have exactly one attribute: value.';

  this.graph.illumination.doubleside = {};

  this.graph.illumination.doubleside.value = this.reader.getFloat(doubleside, 'value');
  if (this.graph.illumination.doubleside.value === null || isNaN(this.graph.illumination.doubleside.value) || (this.graph.illumination.doubleside.value !== 0 && this.graph.illumination.doubleside.value !== 1))
    return 'Doubleside must have a value attribute that is either a 0 or a 1.';
};

LSXParser.prototype.parseIlluminationBackground = function(backgroundArray) {
  if (backgroundArray === null || backgroundArray.length !== 1)
    return 'There must be one and only one background in ILLUMINATION.';

  var background = backgroundArray[0];

  if (background.attributes.length !== 4)
    return 'Background must have exactly four attributes: r, g, b and a.';

  this.graph.illumination.background = {};

  var error = this.getRGBA(background, this.graph.illumination.background);

  if (error !== undefined)
    return error;

};
