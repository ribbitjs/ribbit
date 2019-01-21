function buildRoutesCliCommand(command, routes, appParentDirectory, appRoot) {
  let homeComponent;
  const appRootFile = appRoot ? `/${appRoot}` : '';
  routes.forEach(route => {
    if (route.route === '/') {
      const index = route.component.lastIndexOf('/');
      homeComponent = route.component.substring(index, route.component.length - 3);
      const routeComponentPair = `${homeComponent}=${appParentDirectory}${appRootFile}${route.component.slice(
        1
      )} `;
      command += routeComponentPair;
    } else {
      const routeComponentPair = `${
        route.route
      }=${appParentDirectory}${appRootFile}${route.component.slice(1)} `;
      command += routeComponentPair;
    }
  });

  return { command, homeComponent };
}

module.exports = buildRoutesCliCommand;
