const composeFns = (f, g) => arg => f(g(arg));

module.exports = {
  pipe: (fns = []) => fns.reduce(composeFns)
};
