const path = require('path');
const { renderToNodeStream } = require('react-dom/server');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');
const purifyCSS = require('purify-css');

const decoder = new StringDecoder('utf8');

const ribbitRoutes = require('../consts/globals').USER_RIBBIT_ROUTES;

function htmlTemplate(req, res, next) {
  const { appParentDirectory, jsx, preLoadedState } = res.locals;
  const ribbitConfig = require(path.join(appParentDirectory, '/ribbit.config.js'));
  const templateDir = ribbitConfig.resolve_templates;
  const routeObj = ribbitRoutes.filter(routeObject => routeObject.route===req.url)
  const templateFile = routeObj[0].template;
  console.log("****ribbitRoutes: ", ribbitRoutes);
  console.log("templateDir: ", templateDir);
  console.log("routeObj: ", routeObj);
  console.log("templateFile: ", templateFile);

  const reactStream = renderToNodeStream(jsx);

  let reactDom = '';
  reactStream.on('data', data => {
    reactDom += decoder.write(data);
  });

  // inject state into HTML template
  reactStream.on('end', () => {
    const css = fs.readFile(
      path.resolve(__dirname, '../../dist/styles.min.css'),
      'utf8',
      (err, data) => {
        const criticalCSS = purifyCSS(reactDom, data);
        //
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
          <script>
          window.RIBBIT_PRELOADED_STATE = ${JSON.stringify(preLoadedState).replace(/</g)}
          </script>
          <script src="${ribbitConfig.bundleRoot}.js"></script>
          </body>
          </html>
          `;
        res.locals = {
          ...res.locals,
          html
        };
        next();
      }
    );
  });
}

module.exports = htmlTemplate;
