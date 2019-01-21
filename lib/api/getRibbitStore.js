import { createStore, applyMiddleware } from 'redux';

const getRibbitStore = (combinedReducers, middleware) => {
  let store;
  // check if rendering is happening on the client or the server.

  if (typeof window !== 'undefined') {
    // get state from window
    const preloadedState = window.__PRELOADED_STATE__;
    delete window.__PRELOADED_STATE__;

    // pass state into redux store
    store = createStore(combinedReducers, preloadedState, applyMiddleware(middleware));
  } else {
    store = createStore(combinedReducers, applyMiddleware(middleware));
  }
  return store;
};

export default getRibbitStore;
