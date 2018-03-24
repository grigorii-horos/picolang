const functions = require('./functions');

module.exports = (value) => {
  if (functions[value]) {
    // Function Call
    return {
      type: 'CallExpresion',
      value: functions[value],
    };
  }

  if (!isNaN(parseFloat(value))) {
    // Number
    return {
      type: 'Literal',
      dataType: 'number',
      value: +value,
    };
  }
  if (value[0] === '"' && value.slice(-1) === '"') {
    // String
    return {
      type: 'Literal',
      value,
    };
  }
};
