#!/usr/bin/env node

const program = require('commander');

program.version('1.0.0').description('Standalone serverside rendering CLI tool');
const commands = require('../lib/index');

program.version('1.0.0').description('Standalone server side rendering CLI tool');

program
  .command('build')
  .alias('b')
  .description('Generate your static files')
  .action(commands.build);

/*
// Command templte:
program
  .command('update <_id>')
  .alias('u')
  .description('Update a customer')
  .action(_id => {
    prompt(questions).then(answers => updateCustomer(_id, answers));
  });
*/

program
  .command('init')
  .option('-css, --css [cssFormat]', 'internal, external, inline')
  .option('-v, --view [viewFormat]', 'html, phtml')
  .option('-p, --prefetch-img', 'Prefetch images')
  .description('Create Ribbit routes and config files')
  .action(args => {
    const { css, view, prefetchImg = false } = args;
    commands.init({
      css,
      view,
      images: { prefetchImg }
    });
  });

program
  .command('add-workspace')
  .description('Set-up a new workspace')
  .action(() => {
    console.log('New workspace builder');
  });

program.parse(process.argv);
