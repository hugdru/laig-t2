function Plane(scene, amplifS, amplifT, divisions, vertexTopLeft, vertexBottomRight) {
  CGFobject.call(this, scene);

  if (scene == null ||
    vertexTopLeft.constructor !== Array || vertexTopLeft.length !== 2 ||
    vertexBottomRight.constructor !== Array || vertexBottomRight.length !== 2 ||
    amplifS == null || amplifT == null
  ) {
    throw new Error('Plane, must have valid arguments.');
  }

  var width = vertexBottomRight[0] - vertexTopLeft[0];
  var height = vertexTopLeft[1] - vertexBottomRight[1];

  if (this.width <= 0 || this.height <= 0) throw new Error('Plane, first is topLeft and second is BottomRight.');

  this.startVertex = {
    x: vertexTopLeft[0],
    y: vertexBottomRight[1]
  };

  this.divisions = divisions || 1;
  this.amplifS = amplifS;
  this.amplifT = amplifT;

  this.heightStep = height / this.divisions;
  this.widthStep = width / this.divisions;

  this.heightTextureStep = this.heightStep / this.amplifS;
  this.widthTextureStep = this.widthStep / this.amplifT;

  this.period = this.divisions + 1;

  this.initBuffers();
}

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.initBuffers = function() {

  this.vertices = [];
  this.normals = [];
  this.indices = [];
  this.texCoords = [];

  var sCoord = 0;
  var workVertex = {
    x: this.startVertex.x,
    y: this.startVertex.y
  };
  var lengthIndexTimesPeriod = 0;
  var lengthIndexTimesPeriodNext = this.period;
  for (var lengthIndex = 0; lengthIndex <= this.divisions; ++lengthIndex) {

    workVertex.y = this.startVertex.y;
    var tCoord = 0;
    for (var heightIndex = 0; heightIndex <= this.divisions; ++heightIndex) {

      this.vertices.push(workVertex.x, workVertex.y, 0);
      this.normals.push(0, 0, 1);
      this.texCoords.push(sCoord, tCoord);

      if (lengthIndex !== this.divisions && heightIndex !== this.divisions) {
        this.indices.push(
          heightIndex + lengthIndexTimesPeriod,
          heightIndex + lengthIndexTimesPeriodNext,
          heightIndex + lengthIndexTimesPeriod + 1,
          heightIndex + lengthIndexTimesPeriod + 1,
          heightIndex + lengthIndexTimesPeriodNext,
          heightIndex + lengthIndexTimesPeriodNext + 1
        );
      }

      workVertex.y += this.heightStep;
      tCoord += this.heightTextureStep;
    }
    workVertex.x += this.widthStep;
    sCoord += this.widthTextureStep;
    lengthIndexTimesPeriod = lengthIndexTimesPeriodNext;
    lengthIndexTimesPeriodNext += this.period;
  }


  this.primitiveType = this.scene.gl.TRIANGLES;

  this.initGLBuffers();
};

Plane.prototype.display = function() {
  this.drawElements(this.primitiveType);
};
