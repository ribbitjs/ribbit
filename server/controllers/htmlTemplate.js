const path = require('path');
const { renderToNodeStream } = require('react-dom/server');
const { StringDecoder } = require('string_decoder');

const decoder = new StringDecoder('utf8');

function htmlTemplate(req, res, next) {
  const { appDir, url, jsx } = res.locals;
  const ribbitConfig = require(path.join(appDir, '/ribbit.config.js'));

  const reactStream = renderToNodeStream(jsx);

  let reactDom = '';
  reactStream.on('data', data => {
    reactDom += decoder.write(data);
  });
  reactStream.on('end', () => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>React SSR</title>
        </head>
  
        <body>
            <div id="app">${reactDom}</div>
            <script src="${ribbitConfig.buildFolder}/main.js"></script>
        </body>
        </html>
    `;

    res.locals.html = html;
    res.locals.appDir = appDir;
    res.locals.url = url;
    next();
  });
}

module.exports = { htmlTemplate };
