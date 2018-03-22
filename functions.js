module.exports = {
  log: x => {
    console.log(x);
    return x;
  },
  plus: x => y => x + y,
  minus: x => y => x - y,
  multiplication: x => y => x * y,
  division: x => y => x / y,
  sqrt: x => Math.sqrt(x),
  pow: x => y => x ** y,
  not: x => !x,
  and: x => y => x && y,
  or: x => y => x || y,
  xor: x => y => x !== y,
  if: x => y => z => {
    if (x) {
      return y;
    }
    return z;
  }
};
