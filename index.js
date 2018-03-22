const functions = require('./functions');
const operators = require('./operators');

let program = require('fs')
  .readFileSync('./program.pls')
  .toString();

const toTokens = string => {
  const result = string
    .split('"')
    .map(function(x, i) {
      if (i % 2 === 0) {
        return x.replace(/\(/g, '').replace(/\)/g, '');
      } else {
        return x.replace(/ /g, '!whitespace!');
      }
    })
    .join('"')
    .trim()
    .split(/\s+/)
    .map(function(x) {
      return x.replace(/!whitespace!/g, ' ');
    });
  return result;
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
    if (operators[token]) {
      return {
        type: 'Operator',
        value: operators[token]
      };
    }
    if (!isNaN(parseFloat(token))) {
      return {
        type: 'Literal',
        dataType: 'number',
        value: +token
      };
    }
    if (token === 'true' || token === 'TRUE') {
      return {
        type: 'Literal',
        dataType: 'bool',
        value: true
      };
    }
    if (token === 'false' || token === 'FALSE') {
      return {
        type: 'Literal',
        dataType: 'bool',
        value: false
      };
    }
    if (token[0] === '"' && token.slice(-1) === '"') {
      return {
        type: 'Literal',
        value: token
      };
    }
    if (token === '=') {
      return {
        type: 'Аssignment',
        value: token
      };
    }
    return {
      type: 'Constant',
      value: token
    };
  });
};

const AST = toAST(tokens);
// console.log(AST);

const execASTPart = ({ AST, variables, results }) => {
  // console.log('----', variables);
  if (
    (AST[0].type === 'Literal' || AST[0].type === 'Constant') &&
    AST[1] &&
    AST[1].type === 'Operator'
  ) {
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
      const executed = execASTPart({ AST: localAST, variables, results });
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
      const executed = execASTPart({ AST: localAST, variables, results });
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
  if (AST[0].type === 'Constant') {
    const value = variables[AST[0].value];
    AST.shift();
    return {
      value,
      AST
    };
  }
};

const execAST = AST => {
  let constantNumber = 0;
  let constantName = '';
  let results = [];
  let variables = {};
  let localAST = [...AST];
  while (localAST[0]) {
    let assigment;
    if (localAST[0].type === 'Constant' && localAST[1].type === 'Аssignment') {
      constantName = localAST[0].value;
      localAST.shift();
      localAST.shift();
      assigment = true;
    }
    result = execASTPart({ AST: localAST, results, variables });
    localAST = result.AST;
    results.push(result.value);
    if (assigment) {
      variables[constantName] = result.value;
    }
  }
  return { results, variables };
};

execAST(AST);
