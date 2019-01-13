const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const { prettifyJS } = require('../utils');

const promptQuestions = require('../prompts/prompts_init');

const configFileExists = fs.existsSync(path.resolve(process.cwd(), 'ribbit.config.js'));
const OVERWRITE = 'OVERWRITE';

async function init({ css = 'internal', view = 'html', images } = {}) {
  if (configFileExists) {
    const promptOverwrite = await inquirer.prompt({
      type: 'confirm',
      name: OVERWRITE,
      value: OVERWRITE,
      message: 'The ribbit.config.js already exists. Would you like to overwrite it?'
    });

    if (!promptOverwrite[OVERWRITE]) {
      return;
    }
  }
  const promptAnswers = await inquirer.prompt(promptQuestions);

  buildConfig({
    ...promptAnswers,
    rules: {
      css,
      view,
      images
    }
  });

  buildRoutes({ ...promptAnswers });
}

async function buildConfig(config) {
  const configWriteStream = fs.createWriteStream(
    path.resolve(process.cwd(), 'ribbit.config.js')
  );
  await configWriteStream.write(`module.exports = ${util.inspect(prettifyJS(config))};`);
  console.log(chalk.bgGreen(`Ribbit config file generated in: ${process.cwd()}`));
}

async function buildRoutes({ appRoot }) {
  const routesWriteStream = fs.createWriteStream(
    path.resolve(`${process.cwd()}/${appRoot}`, 'ribbit.routes.json')
  );
  await routesWriteStream.write(
    JSON.stringify(
      [
        {
          route: '/',
          assetName: 'index',
          component: './ExampleComponent.js'
        },
        {
          route: '/about/contact',
          component: './ExampleContactComponent.js'
        }
      ],
      null,
      2
    )
  );

  console.log(
    chalk.bgGreen(
      `Ribbit routes file generated in: ${process.cwd()}/${appRoot}/ribbit.routes.json`
    )
  );
}

module.exports = init;
