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

SceneGraph.prototype.display = function(node, inheritedMaterial) {
  if (node instanceof Rectangle || node instanceof Cylinder || node instanceof Sphere || node instanceof Triangle)
    node.display();

  else {
    var inheritedTexture = "null";
    var material = inheritedMaterial;

    if (node.material instanceof CGFappearance) {
      material = node.material;
    }

    if (node.texture instanceof CGFtexture) {
      material.setTexture(node.texture);
    }
    else if (node.texture === "clear" && inheritedMaterial.texture instanceof CGFtexture) {
      inheritedTexture = inheritedMaterial.texture;
      inheritedMaterial.texture = undefined;
    }
    else if (inheritedMaterial.texture instanceof CGFtexture) {
      material.setTexture(inheritedMaterial.texture);
    }

    material.apply();

    this.scene.pushMatrix();

    this.applyNodeTransformations(node);

    for (var descendant in node.descendants) {
      this.display(node.descendants[descendant], material);
    }

    this.scene.popMatrix();

    if (inheritedTexture instanceof CGFtexture) {
      inheritedMaterial.setTexture(inheritedTexture);
    }

    if (inheritedMaterial instanceof CGFappearance) {
      inheritedMaterial.apply();
    }
    else {
      this.scene.setDefaultAppearance();
    }
  }
};

SceneGraph.prototype.applyNodeTransformations = function(node) {
  var transformations = node.transformations;

  for (var transformation in transformations) {
    if (transformations[transformation] instanceof Translate) {
      var x = transformations[transformation].x;
      var y = transformations[transformation].y;
      var z = transformations[transformation].z;

      this.scene.translate(x, y, z);
    } else if (transformations[transformation] instanceof Rotate) {
      var axis = transformations[transformation].axis;
      var angle = transformations[transformation].angle;

      if (axis === 'x')
        this.scene.rotate(angle, 1, 0, 0);
      else if (axis === 'y')
        this.scene.rotate(angle, 0, 1, 0);
      else if (axis === 'z')
        this.scene.rotate(angle, 0, 0, 1);
    } else if (transformations[transformation] instanceof Scale) {
      var sx = transformations[transformation].sx;
      var sy = transformations[transformation].sy;
      var sz = transformations[transformation].sz;

      this.scene.scale(sx, sy, sz);
    }
  }
};
