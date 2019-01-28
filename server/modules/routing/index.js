const { pipe } = require('../../utils');

const buildRoutes = routes => routes.map(route => route.route);

const buildAssetNameRoutesMap = routes =>
  routes.reduce((acc, curr) => {
    if (curr.assetName) {
      acc[curr.route] = curr.assetName;
    }
    return acc;
  }, {});

// we should discuss post function
const generateRoutes = (plugins, { routeArr = [], config = {}, ...data }) => {
  // console.log('config______', config);

  if (!plugins.length > 0) {
    return {
      routes: buildRoutes(routeArr),
      assetRouteMap: buildAssetNameRoutesMap(routeArr)
    };
  }

  const addPlugins = pipe(plugins);

  return addPlugins({
    previousOutput: { routeArr, config, ...data },
    routeArr,
    config,
    ...data
  });
};

module.exports = generateRoutes;
