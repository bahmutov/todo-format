/* global gt */
gt.module('checking todos in file');

var join = require('path').join;
var index = join(__dirname, '../index.js');

gt.async('valid todos', function () {
  var filename = join(__dirname, 'valid.txt');
  gt.exec('node', [index, filename], 0, 'all todos are valid');
});

gt.async('invalid todos', function () {
  var filename = join(__dirname, 'invalid-todos.txt');
  gt.exec('node', [index, filename], 4, 'exits with number of invalid todos');
});

function isJson(str) {
  try {
    var o = JSON.parse(str);
    return true;
  } catch (err) {
    return false;
  }
}

gt.async('invalid todos with json output', function () {
  var filename = join(__dirname, 'invalid-todos.txt');
  gt.exec('node', [index, filename, '--json'], 4, function (stdout, stderr) {
    gt.ok(isJson(stdout), 'output should be json\n' + stdout);
  });
});
