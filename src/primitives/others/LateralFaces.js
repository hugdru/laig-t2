function LateralFaces(scene, amplifS, amplifT, height, bottomRadius, topRadius, slices, stacks) {
  CGFobject.call(this, scene);

  // Falta fazer as textures
  if (slices == null || slices < 3 || stacks == null || stacks < 1) {
    return 'There must be at least 3 slices and 1 stack.';
  }

  if (height == null || height <= 0) {
    return 'The height must be greater than 0';
  }

  if (bottomRadius == null || topRadius == null || bottomRadius < 0 || topRadius < 0 || (topRadius === 0 && bottomRadius === 0)) {
    return 'BottomRadius and topRadius cannot be simultaneously zero, and they must be greater or equal to 0';
  }

  this.slices = slices;
  this.stacks = stacks;
  this.height = height;
  this.bottomRadius = bottomRadius;
  this.topRadius = topRadius;

  this.stackStep = this.height / this.stacks;

  this.radiusStep = (this.topRadius - this.bottomRadius) / this.height * this.stackStep;

  this.tetaStep = (2 * Math.PI) / this.slices;
  this.stackPeriod = this.stacks + 1;

  this.initBuffers();
}

LateralFaces.prototype = Object.create(CGFobject.prototype);
LateralFaces.prototype.constructor = LateralFaces;

LateralFaces.prototype.initBuffers = function() {
  this.vertices = [];
  this.indices = [];
  this.normals = [];

  var teta = 0;
  var stackPeriodTimesSliceIndex = 0;
  var stackPeriodTimesSliceIndexNext = this.stackPeriod;
  for (var sliceIndex = 0; sliceIndex <= this.slices; ++sliceIndex) {

    var radius = this.bottomRadius;
    var stackAccumulator = -0.5 * this.height;

    for (var stackIndex = 0; stackIndex <= this.stacks; ++stackIndex) {

      var vertexX = radius * Math.sin(teta);
      var vertexZ = radius * Math.cos(teta);

      /* Vertex */
      this.vertices.push(vertexX, stackAccumulator, vertexZ);

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
      stackAccumulator += this.stackStep;
      radius += this.radiusStep;
    }
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
