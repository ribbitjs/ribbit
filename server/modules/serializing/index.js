const { pipe } = require('../../utils');

const generateClientData = (plugins = [], { config = {} }) => {
  const { window } = require(`../../../dist/App.js`); // should come from serialize object
  if (!plugins.length > 0) {
    return {
      clientData: {
        window
      }
    };
  }

  const addPlugins = pipe(plugins);

  return addPlugins({ config });
};

const preloadData = (app, preloadArray = []) => {
  app.get(['/preload-push', '/preload-pop'], (req, res) => {
    const arrayCommand = req.url.substring(req.url.lastIndexOf('-') + 1);
    if (arrayCommand === 'push') {
      preloadArray.push(1);
      res.end();
    } else if (arrayCommand === 'pop') {
      preloadArray.pop();
      res.end();
    }
  });
};

module.exports = {
  generateClientData,
  preloadData
};
