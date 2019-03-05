const fsExtra = require('fs-extra');

function renderStaticFiles(req, res, next) {
  const { appParentDirectory, html, routeAndAssetName, routesCliCommand } = res.locals;
  let componentRoute = req.url;

  if (req.url === '/') {
    componentRoute = routesCliCommand.homeComponent;
  }
  let file;
  let manifestPair;

  if (routeAndAssetName[req.url]) {
    file = `${appParentDirectory}/ribbit.statics/${routeAndAssetName[req.url]}`;
    manifestPair = [req.url, `ribbit.statics/${routeAndAssetName[req.url]}`];
  } else {
    file = `${appParentDirectory}/ribbit.statics${componentRoute}`;
    manifestPair = [req.url, `ribbit.statics${componentRoute}`];
  }

  fsExtra.outputFile(`${file}.html`, html, err => {
    if (err) console.log(err);
    res.send(manifestPair);
  });
}

module.exports = renderStaticFiles;
