const fs = require('fs');

// exists takes in a pathString and determines if it exists
// directoryOrFile takes in a path string and returns a string

const exists = (pathString, fileOrDirectory) => {
  const absolutePathString = `${process.env.PWD}/${pathString}`;
  return fs.existsSync(absolutePathString)
    ? true
    : `Entered ${fileOrDirectory} does not exist`;
};

module.exports = [
  {
    type: 'input',
    name: 'appRoot',
    message: 'Directory containing the highest level component',
    validate: input => exists(input, 'directory')
  },
  {
    type: 'input',
    name: 'app',
    message: 'File containing the highest level component',
    default: 'app.js',
    validate: (input, answersHash) => exists(`${answersHash.appRoot}/${input}`, 'file')
  },
  {
    type: 'input',
    name: 'bundleRoot',
    message: 'Bundle output directory',
    default: 'dist',
    validate: input => exists(input, 'directory')
  },
  {
    type: 'input',
    name: 'bundle',
    message: 'Bundle file',
    default: 'bundle.js',
    validate: (input, answersHash) => exists(`${answersHash.bundleRoot}/${input}`, 'file')
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
