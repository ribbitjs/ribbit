const fs = require('fs');

const validateInput = (input, type, directory) => {
  const testFile = directory ? `${directory}/${input}` : `${input}`;
  return fs.existsSync(`${process.env.PWD}/${testFile}`)
    ? true
    : `Entered ${type} does not exist`;
};

let appRoot;
let bundleRoot;

module.exports = [
  {
    type: 'input',
    name: 'appRoot',
    message: 'Directory containing the highest level component',
    validate: input => {
      appRoot = input;
      return validateInput(input, 'folder');
    }
  },
  {
    type: 'input',
    name: 'app',
    message: 'File containing the highest level component',
    default: 'app.js',
    validate: input => validateInput(input, 'file', appRoot)
  },
  {
    type: 'input',
    name: 'bundleRoot',
    message: 'Bundle output directory',
    default: 'dist',
    validate: input => {
      bundleRoot = input;
      return validateInput(input, 'folder');
    }
  },
  {
    type: 'input',
    name: 'bundle',
    message: 'Bundle file',
    default: 'bundle.js',
    validate: input => validateInput(input, 'file', bundleRoot)
  },
  {
    type: 'list',
    name: 'bundler',
    message: 'Bundler',
    choices: ['webpack', 'browserify']
  },
  {
    type: 'input',
    name: 'author',
    message: 'Author'
  },
  {
    type: 'list',
    name: 'preset',
    message: 'Preset',
    choices: [
      {
        name: 'react',
        value: 'react'
      },
      {
        name: 'vue',
        value: 'vue'
      },
      {
        name: 'angular',
        value: 'angular'
      }
    ]
  }
];
