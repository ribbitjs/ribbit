const writeStaticFiles = require('./writeStaticFiles');
const { generateDefaultTemplate, generateTemplate } = require('./generateTemplate');

module.exports = {
  generateDefaultTemplate,
  generateTemplate,
  renderPort: 5000,
  writeStaticFiles
};
