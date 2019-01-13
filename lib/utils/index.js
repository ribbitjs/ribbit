module.exports = {
  prettifyJS(obj) {
    return JSON.parse(JSON.stringify(obj, null, 2));
  }
};
