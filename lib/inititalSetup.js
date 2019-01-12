// greet by the language code
const fs = require('fs');
const path = require('path');

exports.initialSetup = () => {
  fs.copyFile(
    path.join(__dirname, 'default.config.js'),
    path.join(process.env.PWD, 'ribbit.config.js'),
    error => {
      if (error) console.error(error);
    }
  );
  fs.copyFile(
    path.join(__dirname, 'default.routes.json'),
    path.join(process.env.PWD, 'ribbit.routes.json'),
    error => {
      if (error) console.error(error);
      console.log(
        `Default config and route file generated.\nBe sure to adjust settings in both files before running ribbit build to generate your static files.`
      );
    }
  );
};
