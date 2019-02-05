// react imports
import React from 'react';
import { StaticRouter } from 'react-router-dom'; // react=router plugin
import { Provider } from 'react-redux';

const executeStream = (req, res, next) => {
  const {
    appParentDirectory,
    clientData: { store, window },
    config,
    phasePlugins,
    preset
  } = res.locals;

  const CompiledApp = require(`../../dist/App.js`).default;
  // console.log(preset);
  if (preset.execution) {
    // console.log(preset.execution);
    preset.execution.forEach(presetMap => {
      const { presetName, presetFn } = presetMap;

      res.locals[presetName] = presetFn(phasePlugins.execution[presetName], CompiledApp, {
        req,
        res,
        store,
        window,
        appParentDirectory,
        config
      });
    });
  }
  // user exports their store from wherever they created it
  // user must give the path to their store file

  // serialize w/ redux plugin
  // during execution of jsxCompose, redux requires a store be passed in

  const context = {};
  const componentRoute = req.url;

  const jsx = (
    // wrap static router in redux Provider in order to user redux state
    <Provider store={store}>
      <StaticRouter context={context} location={componentRoute}>
        <CompiledApp />
      </StaticRouter>
    </Provider>
  );

  res.locals = {
    ...res.locals,
    jsx
  };
  next();
};

module.exports = {
  executeStream
};
