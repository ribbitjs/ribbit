const { preloadPop } = require('./preloadActions');
const ribbitStore = routes => {
  routes.forEach(route => {
    fetch(`http://localhost:5000${route}`)
      .then(response => response.json())
      .then(() => {
        console.log('working...');
        preloadPop();
      })
      .catch(err => console.log(err));
  });
};

export default ribbitStore;
