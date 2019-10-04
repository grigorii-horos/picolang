const util = require('util');
const functions = require('./lib/functions');
const tokenize = require('./lib/tokenize');
const getTree = require('./lib/getTree');
const getASTNode = require('./lib/getASTNode');
const getValues = require('./lib/getValues');

const program = require('fs')
  .readFileSync('./program.pls')
  .toString();

const tokens = tokenize(program);

const tree = getTree(tokens);
const AST = tree.map((node) => getASTNode(node));

// console.log(' AST ------------------');
// console.log(AST);

const execASTNode = ({ AST, variables }) => {
  if (!Array.isArray(AST)) {
    if (variables[AST.value]) {
      return execASTNode({
        AST: variables[AST.value],
        variables: { ...variables },
      });
    }

    return AST;
  }

  if (
    AST[0] // !
    && AST[1]
    && AST[0].type === 'Identifier'
    && AST[1].type === 'VariableAssignment'
  ) {
    return {
      type: 'VariableDefinition',
      name: AST[0].value,
      value: execASTNode({
        AST: AST[2],
        variables: { ...variables },
      }),
    };
  }

  if (
    AST[0] // !
    && AST[1]
    && AST[0].type === 'Identifier'
    && AST[1].type === 'FunctionAssignment'
  ) {
    return {
      type: 'FunctionDefinition',
      name: AST[0].value,
      value: AST[2],
    };
  }

  if (AST[0].value === 'if') {
    if (
      getValues(execASTNode({
        AST: AST[1],
        variables: { ...variables },
      }))
    ) {
      return execASTNode({
        AST: AST[2],
        variables: { ...variables },
      });
    }
    return execASTNode({
      AST: AST[3],
      variables: { ...variables },
    });
  }

  AST = AST.map((ASTNode) => {
    const executed = execASTNode({
      AST: ASTNode,
      variables: { ...variables },
    });
    if (executed.type === 'VariableDefinition') {
      variables[executed.name] = execASTNode({
        AST: executed.value,
        variables: { ...variables },
      });
    }
    if (executed.type === 'FunctionDefinition') {
      variables[executed.name] = executed.value;
    }
    return executed;
  });

  if (typeof AST[0].value === 'function') {
    let value;
    value = AST.shift().value;
    if (!AST[0]) {
      value = value();
    } else {
      value = AST.reduce((fn, ASTNode) => {
        if (typeof value === 'function') {
          value = fn(getValues(execASTNode({
            AST: ASTNode,
            variables: { ...variables },
          })));
        }

        return value;
      }, value);
    }
    value;
    return { type: 'Partial', value };
  }

  return AST;
};
// console.log(' EXEC RESULT ------------------');

const result = execASTNode({
  AST,
  variables: {
    ...functions,
    RANDOM: {
      type: 'Literal',
      value: Math.random(),
    },
    RANDOMFN: {
      type: 'Native',
      value: Math.random,
    },
  },
});

// console.log('RESULT ', result);
