module.exports = {
  // Add the entry point to the clientside of your application here
  root: './client',
  app: './client/App.js',
  author: 'Kermit Scott',
  presets: 'react',
  rules: {
    css: 'internal',
    view: 'html',
    images: {
      prefetch: false
    }
  },
  dependencies: [],
  workspaces: []
};
