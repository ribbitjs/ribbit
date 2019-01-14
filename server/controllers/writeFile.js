const fsExtra = require('fs-extra');

function writeFile(req, res, next) {
  const { appDir, url, html } = res.locals;

  const file = `${appDir}/ribbit.statics/${url}`;

  fsExtra.outputFile(`${file}.html`, html, err => {
    if (err) console.log(err);
    res.end();
  });
}

module.exports = { writeFile };
