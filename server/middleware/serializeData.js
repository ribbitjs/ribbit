const serializeData = (req, res, next) => {
  const { store, window } = require(`../../dist/App.js`); // should come from serialize object
  // pull state out of store
  const preLoadedState = store.getState(); // move into serialize function
  res.locals = {
    ...res.locals,
    preLoadedState,
    clientData: { store, window }
  };

  next();
};

module.exports = {
  serializeData
};
