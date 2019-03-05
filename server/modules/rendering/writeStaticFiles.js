const fs = require('fs');
const sendFetches = require('./sendFetches');
const { bundleFilename, USER_PROJECT_DIRECTORY } = require('../../consts/globals');

const writeStaticFiles = (routes, renderPort, routeFns) => {
  console.log('Listening on port 5000');
  const fetchArray = sendFetches(routes, renderPort);
  Promise.all(fetchArray)
    .then(arrayOfRoutes => {
      const ribbitManifest = arrayOfRoutes.reduce((acc, curr) => {
        acc[curr[0]] = curr[1];
        return acc;
      }, {});

      ribbitManifest.static = `${bundleFilename.slice(1)}`;

      fs.writeFileSync(
        `${USER_PROJECT_DIRECTORY}/ribbit.statics/ribbit.manifest.json`,
        JSON.stringify(ribbitManifest)
      );

      function killServer() {
        if (routeFns.length === 0) {
          console.log('KILL THE SERVER GENTS!!!!');
          process.kill(process.pid, 'SIGINT');
        } else {
          console.log('NOT READY TO KILL SERVER');
          setTimeout(killServer, 500);
        }
      }
      killServer();
    })
    .catch(err => console.log(err));
};

module.exports = writeStaticFiles;
