(function(root) {
  var load = typeof require == 'function' ? require : root.load
    , umd = load('../umd-bestiejs.js') || root['umd-bestiejs']
    , print = typeof console == 'object' && typeof console.log == 'function' ? console.log : root.print
    , fail = false;

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
