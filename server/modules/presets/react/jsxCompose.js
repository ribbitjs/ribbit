import React from 'react';

function jsxCompose(plugins, App, config) {
  const { plugin } = require('@ribbit/react-router');

  if (!plugins.length) {
    return <App />;
  }

  return plugin({ App, config });
}

module.exports = jsxCompose;
