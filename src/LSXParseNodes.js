LSXParser.prototype.parseNodes = function(rootElement) {

  var nodesArray = rootElement.getElementsByTagName('NODES');
  if (nodesArray === null || nodesArray.length !== 1) {
    return 'There must be one and only one NODES.';
  }

  var nodesElement = nodesArray[0];

  if (!(this.graph.hasOwnProperty('nodes') && this.graph.nodes.hasOwnProperty('all'))) {
    return 'nodes.all property should already be defined';
  }

  var nodesObject = this.graph.nodes;
  var allNodesObject = nodesObject.all;

  var error = this.parseNodesRoot(nodesObject, nodesElement.getElementsByTagName('ROOT'));
  if (error !== undefined) {
    return error;
  }

  var elementsOfNodes = nodesElement.children;
  for (var nodeElementIndex = 0; nodeElementIndex < elementsOfNodes.length; ++nodeElementIndex) {
    var nodeElement = elementsOfNodes[nodeElementIndex];
    if (nodeElement.nodeName == 'ROOT') {
      continue;
    } else if (nodeElement.nodeName !== 'NODE') {
      return nodeElement.nodeName + ' element is not valid under NODES.';
    }

    if (nodeElement.attributes.length != 1) {
      return 'NODE element can only have one attribute, id.';
    }

    // Get NODE id
    var id = this.reader.getString(nodeElement, 'id');
    if (id == null) {
      return 'Invalid ID for NODE.';
    }

    if (allNodesObject.hasOwnProperty(id)) {
      return 'There already exists a NODE with the id, ' + id;
    }

    allNodesObject[id] = {};
    nodeObject = allNodesObject[id];

    var nodeElementChildren = nodeElement.children;
    var nodeElementChildrenLength = nodeElementChildren.length;

    if (nodeElementChildrenLength < 3) {
      return 'There must be at least 3 elements under a NODE: MATERIAL, TEXTURE, DESCENDANTS';
    }

    nodeObject.transformations = [];

    var minimumElementCount = 0;
    for (var index = 0; index < nodeElementChildrenLength; ++index) {
      var elementOfNode = nodeElementChildren[index];
      switch (elementOfNode.nodeName) {
        case 'MATERIAL':
          if (nodeObject.hasOwnProperty('material')) {
            return 'There can only be one MATERIAL under NODE.';
          }
          error = this.parseNodesMaterial(nodeObject, elementOfNode);
          if (error !== undefined) {
            return error;
          }
          ++minimumElementCount;
          break;
        case 'TEXTURE':
          if (nodeObject.hasOwnProperty('texture')) {
            return 'There can only be one TEXTURE under NODE.';
          }
          error = this.parseNodesTexture(nodeObject, elementOfNode);
          if (error !== undefined) {
            return error;
          }
          ++minimumElementCount;
          break;
        case 'DESCENDANTS':
          if (nodeObject.hasOwnProperty('descendants')) {
            return 'There can only be one DESCENDANTS under NODE.';
          }
          nodeObject.descendants = [];
          error = this.parseNodesDescendants(nodeObject, elementOfNode);
          if (error !== undefined) {
            return error;
          }
          ++minimumElementCount;
          break;
        case 'TRANSLATION':
          error = this.parseNodesTranslation(nodeObject, elementOfNode);
          if (error !== undefined) {
            return error;
          }
          break;
        case 'ROTATION':
          error = this.parseNodesRotation(nodeObject, elementOfNode);
          if (error !== undefined) {
            return error;
          }
          break;
        case 'SCALE':
          error = this.parseNodesScale(nodeObject, elementOfNode);
          if (error !== undefined) {
            return error;
          }
          break;
        default:
          return nodeElementChildren[index].nodeName + ' is not a valid element under NODE.';
      }
    }
    if (minimumElementCount !== 3) {
      return 'NODE must have one element of: MATERIAL, TEXTURE, and DESCENDANTS.';
    }
  }

  // Check if ids in descendants really exist and convert them to "pointers"
  for (var nodeId in allNodesObject) {
    var nodeObjectDescendants = allNodesObject[nodeId].descendants;
    for (var descendantId in nodeObjectDescendants) {
      if (allNodesObject.hasOwnProperty(nodeObjectDescendants[descendantId])) {
        nodeObjectDescendants[descendantId] = allNodesObject[nodeObjectDescendants[descendantId]];
      } else {
        return 'NODE ' + nodeId + ' has an unexisting node as descendant, ' + nodeObjectDescendants[descendantId];
      }
    }
  }

  if (allNodesObject.hasOwnProperty(nodesObject.root)) {
    nodesObject.root = allNodesObject[nodesObject.root];
  } else {
    return 'ROOT NODE is missing, create a NODE with id, ' + nodesObject.root;
  }
};

LSXParser.prototype.parseNodesRoot = function(nodesObject, rootArray) {

  if (nodesObject == null || rootArray == null || rootArray.length !== 1) {
    return 'There must be one and only one ROOT in NODES';
  }

  var rootElement = rootArray[0];

  if (rootElement.attributes.length !== 1) {
    return 'ROOT element must have exactly one attribute: id.';
  }

  nodesObject.root = this.reader.getString(rootElement, 'id');
  if (nodesObject.root == null) {
    return 'Invalid id attribute for ROOT, must be a string';
  }

  if (nodesObject.all.hasOwnProperty(nodesObject.root)) {
    return 'ROOT cannot be a leaf';
  }

};

LSXParser.prototype.parseNodesMaterial = function(nodeObject, elementOfNode) {

  if (nodeObject == null || elementOfNode == null) {
    return 'parseNodesMaterial was expecting a nodeObject and a elementOfNode.';
  }

  if (elementOfNode.attributes.length != 1) {
    return 'MATERIAL can only have 1 attribute, id';
  }

  var materialId = this.reader.getString(elementOfNode, 'id');
  if (materialId == null || (materialId != 'null' && !this.graph.materials.hasOwnProperty(materialId))) {
    return 'MATERIAL of NODE must have an id attribute with a string value, and the material must exist or be null';
  }

  if (materialId != 'null') {
    nodeObject.material = this.graph.materials[materialId];
  } else {
    nodeObject.material = materialId;
  }
};

LSXParser.prototype.parseNodesTexture = function(nodeObject, elementOfNode) {

  if (nodeObject == null || elementOfNode == null) {
    return 'parseNodesMaterial was expecting a nodeObject and a elementOfNode.';
  }

  if (elementOfNode.attributes.length != 1) {
    return 'TEXTURE can only have 1 attribute, id';
  }

  var textureId = this.reader.getString(elementOfNode, 'id');
  if (textureId == null || (textureId != 'null' && textureId != 'clear' && !this.graph.textures.hasOwnProperty(textureId))) {
    return 'TEXTURE of NODE must have an id attribute with a string value, and the material must exist, be null, or clear';
  }

  if (textureId == 'null' || textureId == 'clear') {
    nodeObject.texture = textureId;
  } else {
    nodeObject.texture = this.graph.textures[textureId];
  }
};

LSXParser.prototype.parseNodesDescendants = function(nodeObject, elementOfNode) {

  if (nodeObject == null || elementOfNode == null) {
    return 'parseNodesMaterial was expecting: a nodeObject, a elementOfNode, and a arrayOfUnsolvedDescendantIds.';
  }

  var elementOfNodeChildren = elementOfNode.children;
  var elementOfNodeChildrenLength = elementOfNodeChildren.length;

  if (elementOfNodeChildrenLength < 1) {
    return 'there must be at least one DESCENDANT IN DESCENDANTS';
  }

  for (var index = 0; index < elementOfNodeChildrenLength; ++index) {
    var child = elementOfNodeChildren[index];
    if (child.nodeName !== 'DESCENDANT') {
      return child.nodeName + ' is not valid under DESCENDANTS.';
    }

    if (child.attributes.length != 1) {
      return child.nodeName + ' only supports one attribute, id.';
    }

    // Cannot check if respective node with that id exists cause it might not be created yet
    var idNode = this.reader.getString(child, 'id');
    if (idNode == null) {
      return 'Invalid ID for DESCENDANT.';
    }
    nodeObject.descendants.push(idNode);
  }

};

LSXParser.prototype.parseNodesTranslation = function(nodeObject, elementOfNode) {

  if (nodeObject == null || elementOfNode == null) {
    return 'parseNodesMaterial was expecting a nodeObject and a elementOfNode.';
  }

  var coordinates = 'xyz';

  if (elementOfNode.attributes.length != 3) {
    return 'TRANSLATE can only have 3 attributes: x, y, z';
  }

  translate = new Translate();
  for (var index in coordinates) {
    translate[coordinates[index]] = this.reader.getFloat(elementOfNode, coordinates[index]);
    if (translate[coordinates[index]] === null || isNaN(translate[coordinates[index]])) {
      return 'translate must have an ' + coordinates[index] + ' attribute with a numeric value';
    }
  }
  nodeObject.transformations.push(translate);
};

LSXParser.prototype.parseNodesRotation = function(nodeObject, elementOfNode) {

  if (nodeObject == null || elementOfNode == null) {
    return 'parseNodesMaterial was expecting a nodeObject and a elementOfNode.';
  }

  if (elementOfNode.attributes.length != 2) {
    return 'ROTATION can only have 2 attributes: angle and axis.';
  }

  var coordinates = 'xyz';

  rotation = new Rotate();
  var coordinate = this.reader.getString(elementOfNode, 'axis');
  var coordinateIndex = coordinates.indexOf(coordinate);
  if (coordinateIndex === -1) return 'The axis attribute must be either: x, y or z.';

  rotation[coordinate] = this.reader.getFloat(elementOfNode, 'angle');
  if (rotation[coordinate] === null || isNaN(rotation[coordinate])) {
    return 'The angle value must be a number.';
  }
  nodeObject.transformations.push(rotation);

};

LSXParser.prototype.parseNodesScale = function(nodeObject, elementOfNode) {

  if (nodeObject == null || elementOfNode == null) {
    return 'parseNodesMaterial was expecting a nodeObject and a elementOfNode.';
  }

  if (elementOfNode.attributes.length != 3) {
    return 'SCALE can only have 3 attributes: sx, sy and sz.';
  }

  var scale = new Scale();
  var error = this.getSXYZ(elementOfNode, scale);
  if (error != null) {
    return error;
  }
  nodeObject.transformations.push(scale);

};
