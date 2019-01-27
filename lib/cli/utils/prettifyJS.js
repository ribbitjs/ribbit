function prettifyJS(obj) {
  return JSON.parse(JSON.stringify(obj, null, 2));
}
module.exports = prettifyJS;
