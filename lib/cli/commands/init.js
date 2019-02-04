const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const { prettifyJS } = require('../utils/index');

const promptQuestions = require('../prompts/prompts_init');

const configFileExists = fs.existsSync(path.resolve(process.cwd(), 'ribbit.config.js'));
const OVERWRITE = 'OVERWRITE';
const CONFIRM = 'CONFIRM';

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

  const completeBuild = await buildConfig({
    ...promptAnswers,
    resolve_templates: 'src/templates',
    rules: {
      css,
      view,
      images
    },
    dependencies: [],
    webpackSettings: {}
  });

  if (completeBuild[CONFIRM]) {
    buildRoutes({ ...promptAnswers });
  }
}

async function buildConfig(config) {
  const confirmConfig = await inquirer.prompt({
    type: 'confirm',
    name: CONFIRM,
    value: CONFIRM,
    message: `Does the config file look accurate to you?
      
${JSON.stringify(config, null, 2)}
      
[Confirm or Cancel]
      `
  });

  if (confirmConfig[CONFIRM]) {
    const configWriteStream = await fs.createWriteStream(
      path.resolve(process.cwd(), 'ribbit.config.js')
    );
    await configWriteStream.write(
      `module.exports = ${util.inspect(prettifyJS(config))};`
    );
    console.log(
      chalk.bgGreen(`Ribbit config file generated in: ${process.cwd()}/ribbit.config.js`)
    );
  }

  return confirmConfig;
}

async function buildRoutes({ appRoot }) {
  const appRoutesPath = appRoot ? `/${appRoot}` : '';
  const hasRoutesConfig = fs.existsSync(
    `${process.cwd()}${appRoutesPath}/ribbit.routes.json`
  );

  if (hasRoutesConfig) {
    const overwriteRoutes = await inquirer.prompt({
      type: 'confirm',
      name: OVERWRITE,
      value: OVERWRITE,
      message: 'The ribbit.routes.json already exists. Would you like to overwrite it?'
    });

    if (!overwriteRoutes[OVERWRITE]) {
      return;
    }
  }

  const routesWriteStream = fs.createWriteStream(
    path.resolve(`${process.cwd()}/${appRoot}`, 'ribbit.routes.json')
  );
  await routesWriteStream.write(
    JSON.stringify(
      [
        {
          route: '/',
          assetName: 'index',
          component: './ExampleComponent.js',
          template: ''
        },
        {
          route: '/about/contact',
          component: './ExampleContactComponent.js',
          template: ''
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
