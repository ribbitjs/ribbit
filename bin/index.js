#!/usr/bin/env node

const program = require('commander');
const commands = require('../lib/index');

program.version('1.0.0').description('Standalone server side rendering CLI tool');

program
  .command('build')
  .alias('b')
  .description('Generate your static files')
  .action(commands.build);

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

program.parse(process.argv);
