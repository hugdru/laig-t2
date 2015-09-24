function SceneGraph(filename, scene) {
  this.isLoaded = null;

  // Establish bidirectional references between scene and graph
  this.scene = scene;
  scene.graph = this;

  // File reading
  this.reader = new CGFXMLreader();

  /*
   * Read the contents of the xml file, and refer to this class for loading and error handlers.
   * After the file is read, the reader calls onXMLReady on this object.
   * If any error occurs, the reader calls onXMLError on this object, with an error message
   */

  this.reader.open('../scenes/' + filename, this);
}

/*
 * Callback to be executed after successful reading
 */
SceneGraph.prototype.onXMLReady = function() {
  console.log("XML Loading finished.");
  var rootElement = this.reader.xmlDoc.documentElement;

  // Here should go the calls for different functions to parse the various blocks
  var error = this.parseInitials(rootElement);

  if (error !== undefined) {
    this.onXMLError(error);
    return;
  }

  this.isLoaded = true;

  // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
  this.scene.onGraphLoaded();
};



/*
 * Example of method that parses initials of one block and stores information in a specific data structure
 */
SceneGraph.prototype.parseInitials = function(rootElement) {

  var initialsArray = rootElement.getElementsByTagName('INITIALS');
  if (initialsArray === null || initialsArray.length !== 1) {
    return 'There must be an INITIALS';
  }

  // various examples of different types of access
  var initials = initialsArray[0];
  //this.background = this.reader.getRGBA(globals, 'background');
  //this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill", "line", "point"]);
  //this.cullface = this.reader.getItem(globals, 'cullface', ["back", "front", "none", "frontandback"]);
  //this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw", "cw"]);

  //console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

  //var tempList = rootElement.getElementsByTagName('list');

  //if (tempList == null || tempList.length == 0) {
  //return "list element is missing.";
  //}

  this.initials = {};

  var errors = this.parseInitialsFrustum(initials.getElementsByTagName('frustum'));
  if (errors !== undefined) return errors;
  errors = this.parseInitialsTranslate(initials.getElementsByTagName('translate'));
  if (errors !== undefined) return errors;
  errors = this.parseInitialsRotation(initials.getElementsByTagName('rotation'));
  if (errors !== undefined) return errors;
  //errors = parseInitialsScale(initials.getElementsByTagName('scale'));
  //if (errors !== undefined) return errors;
  //errors = parseInitialsReference(initials.getElementsByTagName('reference'));
  //if (errors !== undefined) return errors;

  // iterate over every element
  //var initialsLen = initials.children.length;
  //for (var i = 0; i < nnodes; i++) {
  //var e = tempList[0].children[i];

  //// process each element and store its information
  //this.list[e.id] = e.attributes.getNamedItem("coords").value;
  //console.log("Read list item id " + e.id + " with value " + this.list[e.id]);
  //};

};

/*
 * Callback to be executed on any read error
 */

SceneGraph.prototype.onXMLError = function(message) {
  console.error("XML Loading Error: " + message);
  this.isLoaded = false;
};

SceneGraph.prototype.parseInitialsFrustum = function(frustumArray) {
  if (frustumArray === null || frustumArray.length !== 1) return 'frustum must exist and only once';

  this.initials.frustum = {};
  this.initials.frustum.near = this.reader.getFloat(frustumArray[0], 'near');
  if (this.initials.frustum.near === null || isNaN(this.initials.frustum.near)) {
    return 'frustum must have a near attribute with a numeric value';
  }
  this.initials.frustum.far = this.reader.getFloat(frustumArray[0], 'far');
  if (this.initials.frustum.far === null || isNaN(this.initials.frustum.far)) {
    return 'frustum must have a far attribute with a numeric value';
  }

};

SceneGraph.prototype.parseInitialsTranslate = function(translateArray) {
  if (translateArray === null || translateArray.length !== 1) return 'translate must exist and only once';

  this.initials.translate = {};
  var coordinates = 'xyz';
  for (var index in coordinates) {
    this.initials.translate[coordinates[index]] = this.reader.getFloat(translateArray[0], coordinates[index]);
    if (this.initials.translate[coordinates[index]] === null || isNaN(this.initials.translate[coordinates[index]])) {
      return 'translate must have an ' + coordinates[index] + ' attribute with a numeric value';
    }
  }
};
SceneGraph.prototype.parseInitialsRotation = function(rotationArray) {
  if (rotationArray === null || rotationArray.length !== 3) return 'rotation must exist, one for each coordinate: x, y, z.';

  this.initials.rotation = {};
  var coordinates = ['x', 'y', 'z'];
  for (var rotationIndex = 0; rotationIndex < rotationArray.length; ++rotationIndex) {
    var coordinate = this.reader.getString(rotationArray[rotationIndex], 'axis');
    var coordinateIndex = coordinates.findIndex(function(value) {
      if (value === coordinate) return true;
    });
    if (coordinateIndex === -1) return 'The axis attribute must be either: x, y or z.';
    delete coordinates[coordinateIndex];

    this.initials.rotation[coordinate] = this.reader.getFloat(rotationArray[rotationIndex], 'angle');
    if (this.initials.rotation[coordinate] === null || isNaN(this.initials.rotation[coordinate])) {
      return 'The angle value must be a number.';
    }
  }
};
//function parseInitialsScale();
//function parseInitialsReference();
