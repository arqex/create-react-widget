import inquirer from "inquirer";
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

let projectName = process.argv[2];
let overwrite = process.argv[3] === '-y';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.resolve(__dirname, '../template');

const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Enter a project name',
    default: 'my-widget',
    when: () => !isProjectNameValid(projectName),
    validate: (input) => {
      if (isProjectNameValid(input)) {
        projectName = input;
        return true;
      }
      return 'Project name may only include letters, numbers, hashes.';
    }
  },
  {
    type: 'confirm',
    name: 'overwrite',
    message: 'The folder already exists. Overwrite existing files?',
    default: false,
    when: () => pathExits(projectName) && !overwrite
  }
];

console.log('');
inquirer.prompt(questions).then(answers => {
  if( answers.overwrite === false ) {
    console.log('Aborting.');
    process.exit(1);
  }

  let resolvedProjectName = projectName;
  let INSTALL_PATH = getInstallPath(projectName);
  if( projectName === '.' ) {
    resolvedProjectName = path.basename(INSTALL_PATH);
  };

  console.log('\n--------------');
  console.log(`Scaffolding widget project in ${INSTALL_PATH} ...`);

  copyTemplateFiles(INSTALL_PATH);
  updatePackageJson(INSTALL_PATH, resolvedProjectName);

  console.log('\nDone. Now run:');
  if( projectName !== '.' ) {
    console.log(`  cd ${resolvedProjectName}`);
  }
  console.log('  npm install');
  console.log('  npm run dev');
  console.log('\nEnjoy!');
  console.log('--------------\n');

});

function getInstallPath( projectName ) {
  return path.resolve(process.cwd(), projectName);
}

function isProjectNameValid(name = '') {
  return /^([A-Za-z\-\d])+$/.test(name) || name === '.';
}

function pathExits( projectName ) {
  if( !projectName ) return false;
  return fs.existsSync(getInstallPath(projectName));
}

function copyTemplateFiles(installPath) {
  fs.copySync(TEMPLATE_PATH, installPath, {'overrite': true, 'recursive': true});
}

function updatePackageJson( installPath, projectName ) {
  const packageJsonPath = path.resolve(installPath, 'package.json');
  const packageJson = fs.readJsonSync(packageJsonPath);
  packageJson.name = projectName;
  fs.writeJsonSync(packageJsonPath, packageJson, {spaces: 2});
}