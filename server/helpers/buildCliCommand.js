export function buildCliCommand(command, routes, appDir) {
  routes.forEach(e => {
    if (e.assetName) {
      const pair = `${e.assetName}=${appDir}${e.component.slice(1)} `;
      command += pair;
    } else {
      if (e.route === '/') {
        const pair = `Home=${appDir}${e.component.slice(1)} `;
        command += pair;
      } else {
        const pair = `${e.route}=${appDir}${e.component.slice(1)} `;
        command += pair;
      }
    }
  });
  return command;
}
