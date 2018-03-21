const functions = require('./functions');
const operators = require('./operators');

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
    if (functions[token]) {
      return {
        type: 'CallExpresion',
        value: functions[token]
      };
    }
    if (!isNaN(token)) {
      return {
        type: 'Literal',
        value: +token
      };
    }
    if (token === 'true' || token === 'TRUE') {
      return {
        type: 'Literal',
        value: true
      };
    }
    if (token === 'false' || token === 'FALSE') {
      return {
        type: 'Literal',
        value: false
      };
    }
    if (operators[token]) {
      return {
        type: 'Operator',
        value: operators[token]
      };
    }
    return {
      type: 'Literal',
      value: token
    };
  });
};

const AST = toAST(tokens);

const execAST = AST => {
  if (AST[0].type === 'Literal' && AST[1] && AST[1].type === 'Operator') {
    let localAST = AST;
    let cache = localAST[0];
    localAST[0] = localAST[1];
    localAST[1] = cache;
    const node = localAST.shift();
    let result;
    if (node.value) {
      result = node.value;
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

  if (AST[0].type === 'CallExpresion') {
    let localAST = AST;
    const node = localAST.shift();
    let result;
    if (node.value) {
      result = node.value;
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

  if (AST[0].type === 'Literal') {
    const value = AST[0].value;
    AST.shift();
    return {
      value,
      AST
    };
  }
};
console.log(execAST(AST).value);
