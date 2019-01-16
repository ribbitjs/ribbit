const fsExtra = require('fs-extra');

function writeFile(req, res, next) {
  const { appParentDirectory, componentRoute, html, routeAndAssetName } = res.locals;
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

module.exports = writeFile;
