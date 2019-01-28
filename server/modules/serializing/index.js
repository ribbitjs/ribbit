const clientData = ({ store, window }) => ({
  store,
  preloadedState: store.getState(),
  window
});

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
  clientData,
  preloadData
};
