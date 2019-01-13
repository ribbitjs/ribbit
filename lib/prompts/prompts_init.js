module.exports = [
  {
    type: 'input',
    name: 'app',
    message: 'File containing the highest level component',
    default: 'app.js'
  },
  {
    type: 'input',
    name: 'appRoot',
    message: 'Directory containing the highest level component'
  },
  {
    type: 'input',
    name: 'bundle',
    message: 'Bundle file',
    default: 'bundle.js'
  },
  {
    type: 'input',
    name: 'bundleRoot',
    message: 'Bundle output directory',
    default: 'dist'
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
