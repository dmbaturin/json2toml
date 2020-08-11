var forEach = require('lodash.foreach');
var isDate = require('lodash.isdate');
var isEmpty = require('lodash.isempty');
var isPlainObject = require('lodash.isplainobject');
var keys = require('lodash.keys');
var strftime = require('strftime');

function format(obj) {
  return isDate(obj)
    ? strftime('%FT%TZ', obj)
    : JSON.stringify(obj);
}

module.exports = function(hash, options={}) {
  function visit(hash, prefix) {
    var nestedPairs = [];
    var simplePairs = [];

    forEach(keys(hash).sort(), function(key) {
      var value = hash[key];
      (isPlainObject(value) ? nestedPairs : simplePairs).push([key, value]);
    });

    if (!(isEmpty(prefix) || isEmpty(simplePairs))) {
      toml += '[' + prefix + ']\n';
      var indent_str = "".padStart(options.indent, " ");
    }

    forEach(simplePairs, function(array) {
      var key = array[0];
      var value = array[1];

      toml += indent_str + key + ' = ' + format(value) + '\n';
    });

    if (!isEmpty(simplePairs) && options.newline_after_section) {
      toml += '\n';
    }

    forEach(nestedPairs, function(array) {
      var key = array[0];
      var value = array[1];

      visit(value, isEmpty(prefix) ? key.toString() : [prefix, key].join('.'));
    });
  }

  var toml = '';

  visit(hash, '');

  return toml.trim();
};
