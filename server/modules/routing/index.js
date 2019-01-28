const { pipe } = require('../../utils');

const buildRoutes = routes => routes.map(route => route.route);

const buildAssetNameRoutesMap = routes =>
  routes.reduce((acc, curr) => {
    if (curr.assetName) {
      acc[curr.route] = curr.assetName;
    }
    return acc;
  }, {});

// todo: set-up genPhasePlugins('routing', 'generateRoutes');
const generateRoutes = (plugins, { routeArr = [], config = {}, ...data }) => {
  if (!plugins.length > 0) {
    return {
      routes: buildRoutes(routeArr),
      assetRouteMap: buildAssetNameRoutesMap(routeArr)
    };
  }

  const addPlugins = pipe(plugins);

  return addPlugins({
    routeArr,
    config,
    ...data
  });
};

module.exports = generateRoutes;
