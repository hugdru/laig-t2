function Sphere(scene, amplifS, amplifT, radius, tetaSections, phiSections) {
  CGFobject.call(this, scene);

  // Falta fazer as textures
  if (scene == null || tetaSections == null || tetaSections < 3 || phiSections == null || phiSections < 2 || radius == null || radius < 0) {
    throw new Error('Sphere, has to have at least 3 tetaSections, 2 phiSections and a positive radius.');
  }

  this.amplifS = amplifS;
  this.amplifT = amplifT;
  this.radius = radius;
  this.tetaSections = tetaSections;
  this.phiSections = phiSections;
  this.tetaPeriod = this.tetaSections + 1;

  this.tetaStep = (2 * Math.PI) / this.tetaSections;
  this.phiStep = Math.PI / this.phiSections;

  this.initBuffers();
  this.wireframe = false;
}

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

Sphere.prototype.initBuffers = function() {

  this.vertices = [];
  this.normals = [];
  this.indices = [];

  var phiAccumulator = 0;
  var tetaPeriodTimesPhiIndex = 0;
  var tetaPeriodTimesNextPhiIndex = this.tetaPeriod;
  for (var phiIndex = 0; phiIndex <= this.phiSections; ++phiIndex) {

    var tetaAccumulator = 0;
    var vertexY = this.radius * Math.cos(phiAccumulator);
    var sinPhiAccumulator = Math.sin(phiAccumulator);

    for (var tetaIndex = 0; tetaIndex <= this.tetaSections; ++tetaIndex) {

      var vertexX = this.radius * sinPhiAccumulator * Math.sin(tetaAccumulator);
      var vertexZ = this.radius * sinPhiAccumulator * Math.cos(tetaAccumulator);

      this.vertices.push(vertexX, vertexY, vertexZ);
      this.normals.push(vertexX / this.radius, vertexY / this.radius, vertexZ / this.radius);

      // Indices
      if (phiIndex != this.phiSections && tetaIndex != this.tetaSections) {
        this.indices.push(
          tetaIndex + tetaPeriodTimesPhiIndex,
          tetaIndex + tetaPeriodTimesNextPhiIndex + 1,
          tetaIndex + tetaPeriodTimesPhiIndex + 1,
          tetaIndex + tetaPeriodTimesPhiIndex,
          tetaIndex + tetaPeriodTimesNextPhiIndex,
          tetaIndex + tetaPeriodTimesNextPhiIndex + 1
        );
      }
      tetaAccumulator += this.tetaStep;
    }
    phiAccumulator -= this.phiStep;
    tetaPeriodTimesPhiIndex = tetaPeriodTimesNextPhiIndex;
    tetaPeriodTimesNextPhiIndex += this.tetaPeriod;
  }

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};

Sphere.prototype.display = function() {
  this.drawElements(this.primitiveType);
};
