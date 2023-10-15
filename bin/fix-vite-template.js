const fs = require("fs-extra");
const path = require("path");

const INSTALL_PATH = path.resolve(__dirname, '..', process.argv[2]);
const TEMPLATE_PATH = path.resolve(__dirname, '../template');

const WIDGET_CODE = `
    <script crossorigin type="module" id="widget" src="/src/main.tsx"></script>
`;

console.log('Fixing template here...', INSTALL_PATH, TEMPLATE_PATH);

(function fixViteTemplate() {
  copyTemplateFiles();
}());

function copyTemplateFiles() {
  console.log('Copying template files...');
  fs.copySync(TEMPLATE_PATH, INSTALL_PATH, {'overrite': true, 'recursive': true});
  console.log('Done.');
}
