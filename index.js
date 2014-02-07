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

var content = read(filename, 'utf-8');
var lines = S(content).lines();
lines.forEach(function (line, k) {
  var todoRegexp = /\ todo/gi;
  var todoFormatRegexp = /\s*TODO\(\w+\):/g;
  if (todoRegexp.test(line)) {
    var valid = todoFormatRegexp.test(line);
    var msg = k +': ' + line;
    if (valid) {
      console.log( chalk.green(msg) );
    } else {
      console.log( chalk.red(msg) );
    }
  }
});
