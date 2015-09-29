function LSXParser(sceneGraph) {
  this.graph  = sceneGraph;
  this.reader = sceneGraph.reader;
}

LSXParser.prototype.read = function(rootElement) {
  var error;

  error = this.parseInitials(rootElement);
  if (error !== undefined)
    return error;

  error = this.parseLights(rootElement);
  if (error !== undefined)
    return error;
};
