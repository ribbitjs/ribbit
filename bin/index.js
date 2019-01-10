#!/usr/bin/env node

'use strict';

const program = require('commander');

const { initialSetup } = require('../lib/controller');

/* - Setting up default config file for React Cherry
	- Be sure to check .react-cherry.config and add your entry point
	- Once you're ready, run 'reactcherry build' to generate your static files	*/

program.version('1.0.0').description('Standalone serverside rendering CLI tool');

if (process.argv.length <= 2) {
  initialSetup();
}

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

program.parse(process.argv);
