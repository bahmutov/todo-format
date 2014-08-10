require('console.json');
var check = require('check-types');
var chalk = require('chalk');

var exists = require('fs').existsSync;
var read = require('fs').readFileSync;
var checkTodos = require('./src/todo-format');
check.verify.fn(checkTodos, 'missing check todos function');
var pkg = require('./package.json');

var filename = process.argv[2];
if (!check.unemptyString(filename)) {
  console.error('usage', pkg.name, '<input filename>');
  process.exit(-1);
}
if (!exists(filename)) {
  console.error(chalk.red('could not find file', filename));
  process.exit(-1);
}

var outputJson = process.argv.some(function (arg) {
  return arg === '--json';
});

var content = read(filename, 'utf-8');
var errors = checkTodos({
  content: content,
  verbose: !outputJson,
  filename: filename
});

if (outputJson) {
  console.json(errors);
}
process.exit(errors.length);
