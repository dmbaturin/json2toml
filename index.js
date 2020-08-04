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

module.exports = function(hash, indent=0, newline_after_section=false) {
  function visit(hash, prefix, indent, newline_after_section) {
    var nestedPairs = [];
    var simplePairs = [];

    forEach(keys(hash).sort(), function(key) {
      var value = hash[key];
      (isPlainObject(value) ? nestedPairs : simplePairs).push([key, value]);
    });

    if (!(isEmpty(prefix) || isEmpty(simplePairs))) {
      toml += '[' + prefix + ']\n';
      var indent_str = "".padStart(indent, " ");
    }

    forEach(simplePairs, function(array) {
      var key = array[0];
      var value = array[1];

      toml += indent_str + key + ' = ' + format(value) + '\n';
    });

    if (!isEmpty(simplePairs) && newline_after_section) {
      toml += '\n';
    }

    forEach(nestedPairs, function(array) {
      var key = array[0];
      var value = array[1];

      visit(value, isEmpty(prefix) ? key.toString() : [prefix, key].join('.'), indent, newline_after_section);
    });
  }

  var toml = '';

  visit(hash, '', indent, newline_after_section);

  return toml.trim();
};
