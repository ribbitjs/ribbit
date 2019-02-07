function preloadPush() {
  fetch('http://localhost:5000/preload-push')
    .then(() => console.log('working...'))
    .catch(err => console.log(err));
}

function preloadPop() {
  fetch('http://localhost:5000/preload-pop')
    .then(() => console.log('working...'))
    .catch(err => console.log(err));
}

module.exports = { preloadPush, preloadPop };
