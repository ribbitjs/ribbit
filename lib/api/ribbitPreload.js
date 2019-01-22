const { preloadPush } = require('./preloadActions');

const ribbitRequestFactory = () => {
  const fetched = {};

  function ribbitPreload(cb, component) {
    // only perform fetch if running on the server
    if (typeof window === 'undefined') {
      // dont let component continue to send requests after initial preload
      if (!fetched[component]) {
        fetched[component] = true;
        cb();
        preloadPush();
      }
    }
  }

  return ribbitPreload;
};

const ribbitPreload = ribbitRequestFactory();

export default ribbitPreload;
