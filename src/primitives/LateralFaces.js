function LateralFaces(scene, amplifS, amplifT, slices, stacks) {
    CGFobject.call(this, scene);

    // Falta fazer as textures
    if (slices == null || slices < 3 || stacks == null || stacks < 1) {
      return 'There must be at least 3 slices and 1 stack.';
    }

    this.stackStep = 1 / this.stacks;

    this.teta = (2 * Math.PI) / this.slices;
    this.startVertexPeriod = this.stacks + 1;

    this.initBuffers();
}

LateralFaces.prototype = Object.create(CGFobject.prototype);
LateralFaces.prototype.constructor = LateralFaces;

LateralFaces.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];

    for (sliceIndex = 0; sliceIndex <= this.slices; ++sliceIndex) {

        // A lateral face
        var stackAcc = -0.5;
        var periodSlicesN = this.startVertexPeriod * sliceIndex;
        var periodSlicesNnext = this.startVertexPeriod * (sliceIndex + 1);
        var currentRad = sliceIndex * this.teta;
        var tCoord = this.minT;
        for (var stackIndex = 0; stackIndex <= this.stacks; ++stackIndex) {

            /* Vertex */
            var currentRadCos = Math.cos(currentRad);
            var currentRadSin = Math.sin(currentRad);
            this.vertices.push(
                currentRadCos,
                currentRadSin,
                stackAcc
            );

            /* Normals */
            this.normals.push(
                currentRadCos,
                currentRadSin,
                0
            );

            /* Indices */
            if (stackIndex != this.stacks && sliceIndex != this.slices) {
                var startVertex = stackIndex + 1;
                this.indices.push(
                    startVertex + periodSlicesN,
                    startVertex - 1 + periodSlicesN,
                    startVertex - 1 + periodSlicesNnext,
                    startVertex + periodSlicesN,
                    startVertex - 1 + periodSlicesNnext,
                    startVertex + periodSlicesNnext
                );
            }
            stackAcc += this.stackStep;
            tCoord += this.patchLengthT;
        }
    }
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

LateralFaces.prototype.display = function() {
    this.drawElements(this.primitiveType);
};
