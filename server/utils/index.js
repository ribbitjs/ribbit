const composeFns = (g, f) => arg => f(g(arg));

module.exports = {
  pipe: (fns = []) => fns.reduce(composeFns)
};
