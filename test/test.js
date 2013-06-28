(function(root) {
  var load = typeof require == 'function' ? require : root.load
    , print = typeof console == 'object' && typeof console.log == 'function' ? console.log : root.print
    , fail = false;

  var filePath = (function () {
    var min = 0, result;
    if (root.phantom) result = root.phantom.args;
    else if (root.system) result = (min = 1, root.system.args);
    else if (root.process) result = (min = 2, root.process.argv);
    else result = root.arguments || [];
    var last = result[result.length - 1];
    result = (result.length > min && !/test\.js$/.test(last)) ? last : 'nothing';
    try {
      return require('fs').realpathSync(result);
    } catch (e) {
      return result;
    }
  }());

  var name = /([^\/]+)\.js/.exec(filePath)[1]
    , umd = load(filePath) || root[name];

  function assert(actual, expected, message) {
    if (actual === expected) print('ok ' + (message || ''));
    else {
      fail = true;
      print('not ok ' + (message || ''));
    }
  }

  assert(umd.test, 'bar');

  if (fail) throw new Error('not ok');
}(this));
