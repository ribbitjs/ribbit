const path = require('path');
const { renderToNodeStream } = require('react-dom/server');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');
const purifyCSS = require('purify-css');

const decoder = new StringDecoder('utf8');

const ribbitRoutes = require('../consts/globals').USER_RIBBIT_ROUTES;
const {
  generateDefaultTemplate,
  generateTemplate
} = require('../modules/rendering/generateTemplate');

function htmlTemplate(req, res, next) {
  const { appParentDirectory, jsx, preLoadedState } = res.locals;
  const ribbitConfig = require(path.join(appParentDirectory, '/ribbit.config.js'));
  const templateDir = ribbitConfig.resolve_templates || 'src/templates';
  const routeObj = ribbitRoutes.filter(routeObject => routeObject.route === req.url);
  const templateFile = routeObj[0].template || 'template.html';
  const htmlTemplatePath = path.join(
    appParentDirectory,
    `${templateDir + '/' + templateFile}`
  );
  let html;
  if (fs.existsSync(htmlTemplatePath)) {
    html = fs.readFileSync(htmlTemplatePath).toString('utf8');
  } else {
    html = generateDefaultTemplate();
  }
  const reactStream = renderToNodeStream(jsx);

  let reactDom = '';
  reactStream.on('data', data => {
    reactDom += decoder.write(data);
  });

  const currentComponentPath = `${appParentDirectory}/${
    ribbitConfig.appRoot
  }/${routeObj[0].component.slice(2)}`;

  const pathToComponent = routeObj[0].route.split('/');
  pathToComponent.pop();
  const componentNameArray = routeObj[0].component.split('/');
  const componentName = componentNameArray[componentNameArray.length - 1];
  const finalComponentPath = `/dist${pathToComponent.join('/')}/${componentName}`;
  const { context } = require(path.join(process.env.PWD, finalComponentPath));

  // inject state into HTML template
  reactStream.on('end', () => {
    const css = fs.readFile(
      path.resolve(__dirname, '../../dist/styles.min.css'),
      'utf8',
      (err, data) => {
        const criticalCSS = `<style>${purifyCSS(reactDom, data)}</style>`;
        html = html.replace('<!-- ribbit-css -->', criticalCSS);
        html = html.replace('<!-- ribbit-bundle -->', reactDom);
        html = html.replace(
          '<!--ribbit-scripts-->',
          `<script src="${ribbitConfig.bundleRoot}.js"></script>`
        );

        for (const property in context) {
          html = html.replace(`{{${property}}}`, context[property]);
        }

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
