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

  const CompiledApp = require(`../../dist/App`).default;

  if (preset.execution) {
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

  const context = {};
  const componentRoute = req.url;

  const jsx = (
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
