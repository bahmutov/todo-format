var S = require('string');
var chalk = require('chalk');
require('test-mole');
require('lazy-ass');

function isTodoLine(line) {
  var todoRegexp = /\ todo(\W|$)/gi;
  return todoRegexp.test(line);
}

testMole.it('finds todo lines', function () {
  lazyAss(isTodoLine(' todo(me)'));
  lazyAss(isTodoLine(' TODO(me)'));
  lazyAss(isTodoLine(' TODO()'));
  lazyAss(isTodoLine('TODO() TODO()'));
});

testMole.it('does not find todo lines', function () {
  lazyAss(!isTodoLine('todo(john)'), 'without a space');
  lazyAss(!isTodoLine('todo(john)'), 'without a space');
});

function isValidTodoLine(line) {
  var todoFormatRegexp = /\s*TODO\(\w+\):/g;
  return todoFormatRegexp.test(line);
}

testMole.it('checks todo format', function () {
  lazyAss(isValidTodoLine('TODO(jim):'));
  lazyAss(isValidTodoLine('TODO(jim_smith):'));
  lazyAss(!isValidTodoLine('TODO(jim smith):'), 'with spaces');
});

function checkTodos(opts) {
  opts = opts || {};
  var content = opts.content || '';
  var verbose = Boolean(opts.verbose);
  var filename = opts.filename || '';

  var lines = S(content).lines();
  var errors = [];

  lines.forEach(function (line, k) {
    var lineNumber = k + 1;

    if (isTodoLine(line)) {
      var valid = isValidTodoLine(line);
      var msg = lineNumber +': ' + line;

      if (valid) {
        if (verbose) {
          console.log( chalk.green(msg) );
        }
      } else {
        var error = {
          file: filename,
          line: lineNumber,
          col: 0,
          reason: 'invalid todo format, should be "TODO(name):"',
          code: 0
        };
        if (verbose) {
          console.log( chalk.red(msg) );
        }
        errors.push(error);
      }
    }
  });

  return errors;
}

module.exports = checkTodos;
