function LateralFaces(scene, amplifS, amplifT, height, bottomRadius, topRadius, slices, stacks) {
  CGFobject.call(this, scene);

  if (scene == null ||
    height == null || height <= 0 ||
    bottomRadius == null || bottomRadius < 0 ||
    topRadius == null || topRadius < 0 ||
    topRadius === 0 && bottomRadius === 0 ||
    slices == null || slices < 3 ||
    stacks == null || stacks < 1)
    {
    throw new Error('LateralFaces, must have valid arguments.');
  }

  this.applyTexture = !isNaN(amplifS) && !isNaN(amplifT) && amplifS !== 0 && amplifT !== 0;

  this.slices = slices;
  this.stacks = stacks;
  this.height = height;
  this.bottomRadius = bottomRadius;
  this.topRadius = topRadius;
  this.amplifS = amplifS;
  this.amplifT = amplifT;

  this.tetaStep = (2 * Math.PI) / this.slices;
  this.stackStep = this.height / this.stacks;
  this.radiusStep = (this.topRadius - this.bottomRadius) / this.height * this.stackStep;

  this.stackPeriod = this.stacks + 1;

  if (this.applyTexture) {
    this.tetaTextureStep = this.tetaStep / this.amplifS;
    this.stackTextureStep = this.stackStep / this.amplifT;
  }

  this.initBuffers();
}

LateralFaces.prototype = Object.create(CGFobject.prototype);
LateralFaces.prototype.constructor = LateralFaces;

LateralFaces.prototype.initBuffers = function() {
  this.vertices = [];
  this.indices = [];
  this.normals = [];
  if (this.applyTexture) this.texCoords = [];

  var sCoord = 0;
  var teta = 0;
  var stackPeriodTimesSliceIndex = 0;
  var stackPeriodTimesSliceIndexNext = this.stackPeriod;
  for (var sliceIndex = 0; sliceIndex <= this.slices; ++sliceIndex) {

    var radius = this.bottomRadius;
    var stackAccumulator = -0.5 * this.height;
    var tCoord = 0;

    for (var stackIndex = 0; stackIndex <= this.stacks; ++stackIndex) {

      var vertexX = radius * Math.sin(teta);
      var vertexZ = radius * Math.cos(teta);

      /* Vertex */
      this.vertices.push(vertexX, stackAccumulator, vertexZ);

      /* Texture */
      if (this.applyTexture) {
        this.texCoords.push(sCoord, tCoord);
      }

      /* Normals */
      this.normals.push(vertexX / radius, 0, vertexZ / radius);

      /* Indices */
      if (stackIndex != this.stacks && sliceIndex != this.slices) {
        var startVertex = stackIndex + 1;
        this.indices.push(
          startVertex + stackPeriodTimesSliceIndex,
          startVertex + stackPeriodTimesSliceIndex - 1,
          startVertex + stackPeriodTimesSliceIndexNext - 1,
          startVertex + stackPeriodTimesSliceIndex,
          startVertex + stackPeriodTimesSliceIndexNext - 1,
          startVertex + stackPeriodTimesSliceIndexNext
        );
      }
      tCoord += this.stackTextureStep;
      stackAccumulator += this.stackStep;
      radius += this.radiusStep;
    }
    sCoord += this.tetaTextureStep;
    teta += this.tetaStep;
    stackPeriodTimesSliceIndex = stackPeriodTimesSliceIndexNext;
    stackPeriodTimesSliceIndexNext += this.stackPeriod;
  }
  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};

LateralFaces.prototype.display = function() {
  this.drawElements(this.primitiveType);
};
