const fsExtra = require('fs-extra');

export function writeFile(req, res, next) {
  const { appParentDirectory, componentRoute, html } = res.locals;

  const file = `${appParentDirectory}/ribbit.statics${componentRoute}`;
  const manifestPair = [req.url, `ribbit.statics${componentRoute}`];
  fsExtra.outputFile(`${file}.html`, html, err => {
    if (err) console.log(err);
    res.send(manifestPair);
  });
}
