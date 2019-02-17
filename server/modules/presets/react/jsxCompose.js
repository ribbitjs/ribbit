import React from 'react';

function jsxCompose(plugins, App, config) {
  if (!plugins.length) {
    return <App />;
  }

  return plugins.reduce((acc, cur, idx, arr) => {
    const currentApp = cur({ App: acc, config });
    if (idx === arr.length - 1) {
      return currentApp;
    }
    return () => currentApp;
  }, <App />);
}

module.exports = jsxCompose;
