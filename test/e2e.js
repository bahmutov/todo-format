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
  gt.exec('node', [index, filename], 3, 'exits with number of invalid todos');
});
