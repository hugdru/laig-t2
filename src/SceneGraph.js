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

  this.lsxParser = new LSXParser(this);
}

/*
 * Callback to be executed after successful reading
 */
SceneGraph.prototype.onXMLReady = function() {
  console.log("XML Loading finished.");

  var rootElement = this.reader.xmlDoc.documentElement;

  //// Here should go the calls for different functions to parse the various blocks
  var error = this.lsxParser.read(rootElement);

  if (error !== undefined) {
    this.onXMLError(error);
    return;
  }

  this.isLoaded = true;

  // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
  this.scene.onGraphLoaded();
};

/*
 * Callback to be executed on any read error
 */

SceneGraph.prototype.onXMLError = function(message) {
  console.error("XML Loading Error: " + message);
  this.isLoaded = false;
};

SceneGraph.prototype.display = function(node) {
  if (node instanceof Rectangle
       || node instanceof Cylinder
       || node instanceof Sphere
       || node instanceof Triangle) {

    node.display();
  }
  else if (node.descendants === undefined)
    return;
  else {
    for (var descendant in node.descendants) {
      this.display(node.descendants[descendant]);
    }
  }
};
