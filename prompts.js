// these prompts are used if the plugin is late-installed into an existing
// project and invoked by `vue invoke`.

const chalk = require('chalk');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const { hasESLintConfig } = require('./utils');

let git;
function hasGit() {
  if (git != null) {
    return git;
  }
  try {
    execSync('git --version', { stdio: 'ignore' });
    git = true;
  } catch (e) {
    git = false;
  }
  return git;
}

const questions = [
  {
    name: 'config',
    type: 'list',
    message: 'Pick an ESLint config:',
    default: 0,
    when: ({ overwriteConfig }) => (overwriteConfig ? overwriteConfig !== 'abort' : true),
    choices: [
      new inquirer.Separator(),
      {
        name: '@winner-fed',
        value: '@winner-fed',
        short: '@winner-fed',
      }
    ]
  }, {
    name: 'lintOn',
    type: 'checkbox',
    message: 'Pick additional lint features:',
    when: ({ overwriteConfig }) => (overwriteConfig ? overwriteConfig !== 'abort' : true),
    choices: [
      {
        name: 'Lint on save',
        value: 'save',
      }, {
        name: `Lint and fix on commit ${hasGit() ? '' : chalk`{red  (requires Git)}`}`,
        value: 'commit',
      },
    ],
  },
];

if (hasESLintConfig(process.cwd())) {
  questions.unshift({
    name: 'overwriteConfig',
    type: 'expand',
    message: 'Existing ESLint config found:',
    choices: [
      {
        key: 'y',
        name: 'Overwrite',
        value: 'overwrite',
      }, {
        key: 'x',
        name: 'Cancel setup (Plugin generator will be invoked, but will not make changes)',
        value: 'abort',
      },
    ],
  });
}

module.exports = questions;
