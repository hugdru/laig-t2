function LateralFaces(scene, amplifS, amplifT, slices, stacks) {
    CGFobject.call(this, scene);

    // Falta fazer as textures
    if (slices == null || slices < 3 || stacks == null || stacks < 1) {
      return 'There must be at least 3 slices and 1 stack.';
    }

    this.slices = slices;
    this.stacks = stacks;

    this.stackStep = 1 / this.stacks;

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

        var stackAccumulator = -0.5;
        var vertexX = Math.sin(teta);
        var vertexZ = Math.cos(teta);

        for (var stackIndex = 0; stackIndex <= this.stacks; ++stackIndex) {

            /* Vertex */
            this.vertices.push(vertexX, stackAccumulator, vertexZ);

            /* Normals */
            this.normals.push(vertexX, 0, vertexZ);

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
