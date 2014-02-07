require('console.json');
var check = require('check-types');
var chalk = require('chalk');
var S = require('string');
var exists = require('fs').existsSync;
var read = require('fs').readFileSync;
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

var errors = [];

var content = read(filename, 'utf-8');
var lines = S(content).lines();
lines.forEach(function (line, k) {
  var todoRegexp = /\ todo\W/gi;
  var todoFormatRegexp = /\s*TODO\(\w+\):/g;
  if (todoRegexp.test(line)) {
    var valid = todoFormatRegexp.test(line);
    var msg = k +': ' + line;
    if (valid && !outputJson) {
      console.log( chalk.green(msg) );
    } else {
      var error = {
        file: filename,
        line: k,
        col: 0,
        reason: 'invalid todo format',
        code: 0
      };
      if (!outputJson) {
        console.log( chalk.red(msg) );
      }
      errors.push(error);
    }
  }
});

if (outputJson) {
  console.json(errors);
}
process.exit(errors.length);
