function preloadPush() {
  fetch('http://localhost:5000/preload-push')
    .then(() => console.log('preload push'))
    .catch(err => console.log(err));
}

function preloadPop() {
  fetch('http://localhost:5000/preload-pop')
    .then(() => console.log('preload pop'))
    .catch(err => console.log(err));
}

module.exports = { preloadPush, preloadPop };
