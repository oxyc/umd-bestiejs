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
    define(['exports', 'umd-standalone'], factory);
  }
  // check for `exports` after `define` in case a build optimizer adds an
  // `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS v0.8.0+
    if (moduleExports) {
      factory(freeModule.exports, require('./umd-standalone'));
    }
    // in Narwhal or RingoJS v0.7.0-
    else {
      factory(freeExports, require('./umd-standalone'));
    }
  }
  // in a browser, Rhino or D8
  else {
    // Rhino or D8
    if (typeof load == 'function') {
      // modules are sourced and not returned. The path should be relative to
      // the executing script, in this case from `test/`
      load(['../umd-standalone.js']);
    }
    factory((root[name] = {}), root['umd-standalone']);
  }
}(this, 'umd-dependencies', function (exports, b) {

  exports.test = b.test;

}));
