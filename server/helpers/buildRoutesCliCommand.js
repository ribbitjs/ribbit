export function buildRoutesCliCommand(command, routes, appParentDirectory) {
  let homeComponent;
  routes.forEach(route => {
    if (route.assetName) {
      const routeComponentPair = `${
        route.assetName
      }=${appParentDirectory}${route.component.slice(1)} `;
      command += routeComponentPair;
    } else {
      if (route.route === '/') {
        const index = route.component.lastIndexOf('/');
        homeComponent = route.component.substring(index);
        const routeComponentPair = `${homeComponent}=${appParentDirectory}${route.component.slice(
          1
        )} `;
        command += routeComponentPair;
      } else {
        const routeComponentPair = `${
          route.route
        }=${appParentDirectory}${route.component.slice(1)} `;
        command += routeComponentPair;
      }
    }
  });
  console.log('========home component===', homeComponent);
  return { command, homeComponent };
}
