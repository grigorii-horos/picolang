module.exports = input => input
  .split('"')
  .map((x, i) => {
    if (i % 2 === 0) {
      // not in string
      return x.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ');
    }
    // in string
    return x.replace(/ /g, '!whitespace!');
  })
  .join('"')
  .trim()
  .split(/\s+/)
  .map(x => x.replace(/!whitespace!/g, ' '));
