// need to add getPhasePlugins
const { generateClientData } = require('../modules/serializing');

const serializeData = (req, res, next) => {
  // pull state out of store
  const { currentRoute } = res.locals;
  const { store, window } = require(`../../dist/App.js`); // should come from serialize object
  console.log('REQ URL_____', req.url);
  console.log('Current Route_____', currentRoute);
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
