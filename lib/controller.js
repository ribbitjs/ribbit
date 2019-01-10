// greet by the language code
const fs = require('fs');
const path = require('path');

exports.initialSetup = () => {
  fs.copyFile(
    path.join(__dirname, 'default.config.js'),
    path.join(process.cwd(), 'ribbit.config.js'),
    error => {
      if (error) console.error(error);
      console.log(
        `Default config file generated\nBe sure to check ribbit.config.js and add your entry point.\nOnce you're ready, run 'ribbit build' to generate your static files.`
      );
    }
  );
};
