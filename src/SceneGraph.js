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

  var errors = parseInitialsFrustum(initials.getElementsByTagName('frustum'));
  console.log(this.initials);
  parseInitialsTranslate(initials.getElementsByTagName('translate'));
  parseInitialsRotation(initials.getElementsByTagName('rotation'));
  parseInitialsScale(initials.getElementsByTagName('scale'));
  parseInitialsReference(initials.getElementsByTagName('reference'));

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

function parseInitialsFrustum(frustumArray, initials) {
  if (frustumArray === null || frustumArray.length !== 1) return 'There must be a frustum';

  initials.frustum = {};
  initials.frustum.near = frustumArray[0].attributes.getNamedItem('near').value;
  initials.frustum.far = frustumArray[0].attributes.getNamedItem('far').value;

};

//function parseInitialsTranslate();
//function parseInitialsRotation();
//function parseInitialsScale();
//function parseInitialsReference();
