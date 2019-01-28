const { preloadPop } = require('./preloadActions');
// re-render page with updated state on the server
const ribbitStore = routes => {
  routes.forEach(route => {
    fetch(`http://localhost:5000${route}`)
      .then(response => response.json())
      .then(() => {
        console.log('Re-render success!');
        preloadPop();
      })
      .catch(err => console.log(err));
  });
};

export default ribbitStore;
