function Sphere(scene, amplifS, amplifT, radius, tetaSections, phiSections) {
  CGFobject.call(this, scene);

  if (scene == null || radius == null || radius <= 0 ||
      tetaSections == null || tetaSections < 3 || phiSections == null ||
      phiSections < 2
     ) {
    throw new Error('Sphere, must have valid arguments.');
  }

  this.applyTexture = !isNaN(amplifS) && !isNaN(amplifT) && amplifS !== 0 && amplifT !== 0;

  this.amplifS = amplifS;
  this.amplifT = amplifT;
  this.radius = radius;
  this.tetaSections = tetaSections;
  this.phiSections = phiSections;
  this.tetaPeriod = this.tetaSections + 1;

  this.tetaStep = (2 * Math.PI) / this.tetaSections;
  this.phiStep = Math.PI / this.phiSections;
  if (this.applyTexture) {
    this.tetaTextureStep = this.tetaStep / this.amplifS;
    this.phiTextureStep = this.phiStep / this.amplifT;
  }

  this.initBuffers();
  this.wireframe = false;
}

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

Sphere.prototype.initBuffers = function() {

  this.vertices = [];
  this.normals = [];
  this.indices = [];
  if (this.applyTexture) this.texCoords = [];

  var phiAccumulator = 0;
  var tetaPeriodTimesPhiIndex = 0;
  var tetaPeriodTimesNextPhiIndex = this.tetaPeriod;
  for (var phiIndex = 0; phiIndex <= this.phiSections; ++phiIndex) {

    var tCoord = 1;
    var tetaAccumulator = 0;
    var vertexY = this.radius * Math.cos(phiAccumulator);
    var sinPhiAccumulator = Math.sin(phiAccumulator);

    var sCoord = 0;
    for (var tetaIndex = 0; tetaIndex <= this.tetaSections; ++tetaIndex) {

      var vertexX = this.radius * sinPhiAccumulator * Math.sin(tetaAccumulator);
      var vertexZ = this.radius * sinPhiAccumulator * Math.cos(tetaAccumulator);

      this.vertices.push(vertexX, vertexY, vertexZ);
      if (this.applyTexture) {
        this.texCoords.push(sCoord, tCoord);
      }
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
      sCoord += this.tetaTextureStep;
      tetaAccumulator += this.tetaStep;
    }
    tCoord -= this.phiTextureStep;
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
