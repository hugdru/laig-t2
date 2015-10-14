function Base(scene, amplifS, amplifT, slices) {
    CGFobject.call(this, scene);

    if (slices == null || slices < 3) {
      return 'Base must have at least 3 slices'
    }

    // FALTA FAZER TEXTURAS

    this.amplifS = amplifS;
    this.amplifT = amplifT;
    this.slices = slices;

    this.teta = 2 * Math.PI / this.slices;

    this.initBuffers();
}

Base.prototype = Object.create(CGFobject.prototype);
Base.prototype.constructor = Base;

Base.prototype.initBuffers = function() {

    var nextSlice;
    this.vertices = [0, 0, 0];
    this.indices = [];
    this.normals = [0, 0, 1];

    for (var sliceIndex = 0; sliceIndex < this.slices; ++sliceIndex) {

        // Vertices
        // Vertex 1
        this.vertices.push(
            Math.cos(sliceIndex * this.teta),
            Math.sin(sliceIndex * this.teta),
            0
        );

        // Indices
        this.indices.push(0);
        this.indices.push(sliceIndex + 1);
        if (sliceIndex == (this.slices - 1)) this.indices.push(1);
        else this.indices.push(sliceIndex + 2);

        // Normals
        this.normals.push(
            0,
            0,
            1
        );
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Base.prototype.display = function() {
  this.drawElements(this.primitiveType);
};

