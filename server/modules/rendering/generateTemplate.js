const generateDefaultTemplate = (css, DOM, state, bundle) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>{{ title }}</title>
{{ meta }}
<style>${css}</style>
</head>
<body>
<div id="app"><!--ribbit-output--></div>
<!--ribbit-scripts-->
</body>
</html>
`;

const generateTemplate = () => {};

module.exports = {
  generateDefaultTemplate,
  generateTemplate
};
