const getNode = (tokens) => {
  if (tokens[0] !== '(') {
    if (tokens[0] === ')') {
      throw new Error('Sysnax error');
    }
    const node = tokens.shift();
    return { node, tokens };
  }

  tokens.shift();
  const node = [];
  while (true) {
    if (!tokens[0]) {
      break;
    }
    if (tokens[0] === ')') {
      break;
    }
    if (tokens[0] === '(') {
      const result = getNode(tokens);
      node.push(result.node);
      tokens = result.tokens;
    }
    if (tokens[0] !== '(' && tokens[0] !== ')') {
      node.push(tokens.shift());
    }
  }
  if (tokens[0] !== ')') {
    throw new Error('Sysnax error');
  }
  tokens.shift();
  return { node, tokens };
};

module.exports = (tokens) => {
  const tree = [];
  while (tokens[0]) {
    const node = getNode(tokens);
    tokens = node.tokens;
    tree.push(node.node);
    // break;
  }
  return tree;
};
