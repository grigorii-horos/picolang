const getValues = (ASTNode) => {
  if (!Array.isArray(ASTNode)) {
    if (ASTNode.value !== undefined) {
      return getValues(ASTNode.value);
    }
    return ASTNode;
  }
  return ASTNode.map((ASTNode) => getValues(ASTNode));
};
module.exports = getValues;
