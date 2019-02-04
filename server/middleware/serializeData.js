// need to add getPhasePlugins
const { generateClientData } = require('../modules/serializing');

const serializeData = (req, res, next) => {
  // pull state out of store
  const { currentRoute } = res.locals;
  const { store, window } = require(`../../dist/App.js`); // should come from serialize object
  const preLoadedState = store.getState(); // move into serialize function

  // todo: set-up genPhasePlugins('serializing', 'clientData');
  const clientData = generateClientData([], {});

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
