import React from 'react';

const { pipe } = require('../../../utils');

function jsxCompose(plugins, App, config) {
  if (!plugins.length) {
    return <App />;
  }

  // console.log('_________JSX COMPOSE START');
  // console.log(plugins.length);
  const addPlugins = pipe(plugins);
  // console.log(addPlugins(<App />, config));
  // console.log('_________JSX COMPOSE END');
  return addPlugins(<App />, config);
}

module.exports = jsxCompose;
