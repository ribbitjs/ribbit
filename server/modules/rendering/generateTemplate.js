const generateDefaultTemplate = () => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<!-- ribbit-css -->
</head>
<body>
<div id="app"><!-- ribbit-bundle --></div>
<!--ribbit-scripts-->
</body>
</html>
`;

const generateTemplate = () => {};

module.exports = {
  generateDefaultTemplate,
  generateTemplate
};
