const getASTNode = (node) => {
  if (!Array.isArray(node)) {
    if (!isNaN(parseFloat(node))) {
      // Number
      return {
        type: 'Literal',
        value: +node,
      };
    }
    if (node[0] === '"' && node.slice(-1) === '"') {
      // String
      return {
        type: 'Literal',
        value: node.slice(1, -1),
      };
    }
    if (node === 'true' || node === 'TRUE') {
      return {
        type: 'Literal',
        value: true,
      };
    }
    if (node === 'false' || node === 'FALSE') {
      return {
        type: 'Literal',
        value: false,
      };
    }
    if (node === '=') {
      return {
        type: 'VariableAssignment',
        value: node,
      };
    }
    if (node === '=>') {
      return {
        type: 'FunctionAssignment',
        value: node,
      };
    }
    return {
      type: 'Identifier',
      value: node,
    };
  }
  return node.map(token => getASTNode(token));
};

module.exports = getASTNode;
