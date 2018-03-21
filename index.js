const operations = require('./functions');

let program = require('fs')
  .readFileSync('./program.pls')
  .toString();

const toTokens = string => {
  return string
    .replace(/[\(\),\n]/g, '')
    .split(' ')
    .filter(item => item);
};

const tokens = toTokens(program);

const toAST = tokens => {
  return tokens.map(token => {
    if (operations[token]) {
      return {
        type: 'CallExpresion',
        value: token
      };
    }
    if (!isNaN(token)) {
      return {
        type: 'NumericLiteral',
        value: +token
      };
    }
    if (token === 'true' || token === 'TRUE') {
      return {
        type: 'BoolLiteral',
        value: true
      };
    }
    if (token === 'false' || token === 'FALSE') {
      return {
        type: 'BoolLiteral',
        value: false
      };
    }
    return {
      type: 'StringLiteral',
      value: token
    };
  });
};

const AST = toAST(tokens);
// _(AST);

const execAST = AST => {
  if (!AST) {
    return 0;
  }
  if (AST[0].type !== 'CallExpresion') {
    const value = AST[0].value;
    AST.shift();
    return {
      value,
      AST
    };
  }

  {
    let localAST = AST;
    const node = localAST.shift();
    let result;
    if (operations[node.value]) {
      result = operations[node.value];
    }

    while (typeof result === 'function') {
      const executed = execAST(localAST);
      localAST = executed.AST;
      result = result(executed.value);
    }
    return {
      value: result,
      AST: localAST
    };
  }
};
console.log(execAST(AST).value);
