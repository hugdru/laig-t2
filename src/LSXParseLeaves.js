LSXParser.prototype.parseLeaves = function(rootElement) {

  var leavesArray = rootElement.getElementsByTagName('LEAVES');
  if (leavesArray === null || leavesArray.length !== 1) {
    return 'There must be one and only one LEAVES.';
  }

  var leavesElement = leavesArray[0];

  this.graph.nodes = {};
  var nodes = this.graph.nodes;

  var error;

  var leafElements = leavesElement.children;
  for (var leafElementIndex = 0; leafElementIndex < leafElements.length; ++leafElementIndex) {
    var leafElement = leafElements[leafElementIndex];
    if (leafElement.nodeName !== 'LEAF') {
      return leafElement.nodeName + ' element is not valid under LEAVES.';
    }

    if (leafElement.attributes.length != 3) {
      return 'There must be exactly three elements in a LEAF: id, type, args';
    }

    // Get LEAF id
    var id = this.reader.getString(leafElement, 'id');
    if (id == null) {
      return 'Invalid ID for LEAF.';
    }

    if (nodes.hasOwnProperty(id)) {
      return 'There already exists a NODE with the id, ' + id;
    }

    nodes[id] = {};
    leaf = nodes[id];

    // Get LEAF type
    leaf.type = this.reader.getString(leafElement, 'type');
    if (leaf.type == null) {
      return 'LEAF must have a type attribute with a string value.';
    }

    // Get the args
    var stringOfNumbers = this.reader.getString(leafElement, 'args');
    if (stringOfNumbers == null) {
      return 'LEAF must have a args attribute.';
    }

    var stringArray = stringOfNumbers.split(/\s+/);
    switch (leaf.type) {
      case 'rectangle':
        var arrayOfNumbers = this.getNumbers(stringArray, "f f f f");
        if (arrayOfNumbers.constructor !== Array) {
          return leaf.type + ' , f f f f , ' + arrayOfNumbers;
        }
        leaf.args = arrayOfNumbers;
        break;
      case 'cylinder':
        arrayOfNumbers = this.getNumbers(stringArray, "f f f i i");
        if (arrayOfNumbers.constructor !== Array) {
          return leaf.type + ' , f f f i i , ' + arrayOfNumbers;
        }
        leaf.args = arrayOfNumbers;
        break;
      case 'sphere':
        arrayOfNumbers = this.getNumbers(stringArray, "f i i");
        if (arrayOfNumbers.constructor !== Array) {
          return leaf.type + ' , f i i , ' + arrayOfNumbers;
        }
        leaf.args = arrayOfNumbers;
        break;
      case 'triangle':
        arrayOfNumbers = this.getNumbers(stringArray, "f f f f f f f f f");
        if (arrayOfNumbers.constructor !== Array) {
          return leaf.type + ' , f f f f f f f f f , ' + arrayOfNumbers;
        }
        leaf.args = arrayOfNumbers;
        break;
      default:
        return 'type attribute of LEAF only accepts 4 primities: rectangle, cylinder, sphere, triangle.';
    }

  }
};
