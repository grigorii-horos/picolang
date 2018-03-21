module.exports = {
  log(x) {
    console.log(x);
    return x;
  },
  plus(x) {
    return y => x + y;
  },
  minus(x) {
    return y => x - y;
  },
  multiplication(x) {
    return y => x * y;
  },
  division(x) {
    return y => x / y;
  },
  sqrt(x) {
    return Math.sqrt(x);
  },
  pow(x) {
    return y => x ** y;
  },
  not(x) {
    return !x;
  },
  and(x) {
    return y => x && y;
  },
  or(x) {
    return y => x || y;
  },
  xor(x) {
    return y => x !== y;
  },
  if(x) {
    return y => z => {
      if (x) {
        return y;
      }
      return z;
    };
  }
};
