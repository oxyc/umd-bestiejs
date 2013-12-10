(function (root, name, factory) {
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };
  // Detect free variable `exports`
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
  // Detect free variable `module`
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
  // Detect the popular CommonJS extension `module.exports`
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
  // Detect free variable `global`, from Node.js or Browserified code, and use
  // it as `window`
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  // some AMD build optimizers, like r.js, check for specific condition
  // patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(['exports', 'b'], factory);
  }
  // check for `exports` after `define` in case a build optimizer adds an
  // `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS v0.8.0+
    if (moduleExports) {
      factory(freeModule.exports, require('./b'));
    }
    // in Narwhal or RingoJS v0.7.0-
    else {
      factory(freeExports, require('./b'));
    }
  }
  // in a browser, Rhino or D8
  else {
    // Rhino or D8
    if (typeof load == 'function') {
      // modules are sourced and not returned. The path should be relative to
      // the executing script, in this case from `test/`
      load(['../b.js']);
    }
    factory((root[name] = {}), root.b);
  }
}(this, 'umd-bestiejs', function (exports, b) {

  exports.test = b.test;

}));
