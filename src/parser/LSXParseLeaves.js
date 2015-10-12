LSXParser.prototype.parseLeaves = function(rootElement) {

  var leavesArray = rootElement.getElementsByTagName('LEAVES');
  if (leavesArray === null || leavesArray.length !== 1) {
    return 'There must be 1 and only 1 LEAVES.';
  }

  var leavesElement = leavesArray[0];

  if (leavesElement.attributes.length !== 0) {
    return 'LEAVES, must not have attributes.';
  }

  this.graph.nodes = {};
  this.graph.nodes.all = {};
  var nodes = this.graph.nodes.all;

  var error;

  var leafElements = leavesElement.children;
  for (var leafElementIndex = 0; leafElementIndex < leafElements.length; ++leafElementIndex) {
    var leafElement = leafElements[leafElementIndex];
    if (leafElement.nodeName !== 'LEAF') {
      return 'LEAVES, ' + leafElement.nodeName + ' element is not valid.';
    }

    if (leafElement.attributes.length != 3) {
      return 'LEAF, there must be exactly 3 elements: id, type and args.';
    }

    // Get LEAF id
    var id = this.reader.getString(leafElement, 'id');
    if (id == null) {
      return 'LEAF, invalid ID.';
    }

    if (nodes.hasOwnProperty(id)) {
      return 'LEAF, ' + id + ', already exists';
    }

    nodes[id] = {};
    leaf = nodes[id];

    // Get LEAF type
    leaf.type = this.reader.getString(leafElement, 'type');
    if (leaf.type == null) {
      return 'LEAF, ' + id + ', must have a type attribute with a string value.';
    }

    // Get the args
    var stringOfNumbers = this.reader.getString(leafElement, 'args');
    if (stringOfNumbers == null) {
      return 'LEAF, ' + id + ', must have an args attribute.';
    }

    var stringArray = stringOfNumbers.split(/\s+/);
    switch (leaf.type) {
      case 'rectangle':
        var arrayOfNumbers = this.getNumbers(stringArray, "f f i i");
        if (arrayOfNumbers.constructor !== Array) {
          return 'LEAF, ' + id + ', ' + leaf.type + ': f f f f .';
        }
        leaf.args = arrayOfNumbers;
        break;
      case 'cylinder':
        arrayOfNumbers = this.getNumbers(stringArray, "f f f i i");
        if (arrayOfNumbers.constructor !== Array) {
          return 'LEAF, ' + id + ', ' + leaf.type + ': f f f i i .';
        }
        leaf.args = arrayOfNumbers;
        break;
      case 'sphere':
        arrayOfNumbers = this.getNumbers(stringArray, "f i i");
        if (arrayOfNumbers.constructor !== Array) {
          return 'LEAF, ' + id + ', ' + leaf.type + ': f i i .';
        }
        leaf.args = arrayOfNumbers;
        break;
      case 'triangle':
        arrayOfNumbers = this.getNumbers(stringArray, "f f f f f f f f f");
        if (arrayOfNumbers.constructor !== Array) {
          return 'LEAF, ' + id + ', ' + leaf.type + ': f f f f f f f f f .';
        }
        leaf.args = arrayOfNumbers;
        break;
      default:
        return 'LEAF, ' + id + ', type attribute only accepts 4 primities: rectangle, cylinder, sphere, triangle.';
    }

  }
};
