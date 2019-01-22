const path = require('path');
const { renderToNodeStream } = require('react-dom/server');
const { StringDecoder } = require('string_decoder');

const decoder = new StringDecoder('utf8');

function htmlTemplate(req, res, next) {
  const { appParentDirectory, componentRoute, jsx, preLoadedState } = res.locals;
  const ribbitConfig = require(path.join(appParentDirectory, '/ribbit.config.js'));

  const reactStream = renderToNodeStream(jsx);

  let reactDom = '';
  reactStream.on('data', data => {
    reactDom += decoder.write(data);
  });

  // inject state into HTML template
  reactStream.on('end', () => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>React SSR</title>
        </head>
  
        <body>
            <div id="root">${reactDom}</div>
            <script>
             window.RIBBIT_PRELOADED_STATE = ${JSON.stringify(preLoadedState).replace(
               /</g
             )}
             </script>
            <script src="${ribbitConfig.bundle}"></script>
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
  });
}

module.exports = htmlTemplate;
