function Base(scene, amplifS, amplifT, slices) {
    CGFobject.call(this, scene);

    if (slices == null || slices < 3) {
      return 'Base must have at least 3 slices';
    }

    // FALTA FAZER TEXTURAS

    this.amplifS = amplifS;
    this.amplifT = amplifT;
    this.slices = slices;

    this.tetaStep = 2 * Math.PI / this.slices;

    this.initBuffers();
}

Base.prototype = Object.create(CGFobject.prototype);
Base.prototype.constructor = Base;

Base.prototype.initBuffers = function() {

    var nextSlice;
    this.vertices = [0, 0, 0];
    this.indices = [];
    this.normals = [0, 1, 0];

    var teta = 0;
    for (var sliceIndex = 0; sliceIndex < this.slices; ++sliceIndex) {

        // Vertices
        this.vertices.push(
            Math.sin(teta),
            0,
            Math.cos(teta)
        );

        // Indices
        this.indices.push(0);
        this.indices.push(sliceIndex + 1);
        if (sliceIndex == (this.slices - 1)) this.indices.push(1);
        else this.indices.push(sliceIndex + 2);

        // Normals
        this.normals.push(0, 1, 0);

        teta += this.tetaStep;
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Base.prototype.display = function() {
  this.drawElements(this.primitiveType);
};

