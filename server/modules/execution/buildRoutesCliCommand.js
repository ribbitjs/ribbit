function buildRoutesCliCommand(command, routes, appParentDirectory, appRoot) {
  let homeComponent;
  const appRootFile = appRoot ? `/${appRoot}` : '';
  const filePath = `${appParentDirectory}${appRootFile}`;
  routes.forEach(route => {
    if (route.route === '/') {
      const index = route.component.lastIndexOf('/');
      homeComponent = route.component.substring(index, route.component.length - 3);

      command += buildPair(homeComponent, filePath, route.component);
    } else {
      command += buildPair(route.route, filePath, route.component);
    }
  });

  console.log(command);
  return { command, homeComponent };
}

function buildPair(name, filePath, fileName) {
  return `${name}=${filePath}${fileName.slice(1)} `;
}

module.exports = buildRoutesCliCommand;
