const path = require('path');
const { renderToNodeStream } = require('react-dom/server');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');
const decoder = new StringDecoder('utf8');
const purifyCSS = require('purify-css');

function htmlTemplate(req, res, next) {
  const { appParentDirectory, componentRoute, jsx } = res.locals;
  const ribbitConfig = require(path.join(appParentDirectory, '/ribbit.config.js'));

  const reactStream = renderToNodeStream(jsx);

  let reactDom = '';
  reactStream.on('data', data => {
    reactDom += decoder.write(data);
  });
  reactStream.on('end', () => {
    const css = fs.readFile(path.resolve(__dirname, '../../dist/styles.min.css'), 'utf8', (err, data) => {
        const criticalCSS = purifyCSS(reactDom, data);
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
          <meta charset="utf-8">
          <title>React SSR</title>
          <style>${criticalCSS}</style>
          </head>
          <body>
          <div id="app">${reactDom}</div>
          <script src="${ribbitConfig.bundleRoot}.js"></script>
          </body>
          </html>
          `;
        res.locals = {
          ...res.locals,
          html,
          appParentDirectory,
          componentRoute
        };
      next();
    })
  });
}

module.exports = htmlTemplate;
