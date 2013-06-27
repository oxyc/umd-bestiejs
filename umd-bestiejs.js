(function (root, name, factory) {
  var objectTypes = {
    'function': true,
    'object': true,
  };
  // Detect free variable `exports`
  var freeExports = objectTypes[typeof exports] && exports;
  // Detect free variable `module`
  var freeModule = objectTypes[typeof module] && module && module.exports == freeExports && module;
  // Detect free variable `global`, from Node.js or Browserified code, and use it as `window`
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  // some AMD build optimizers, like r.js, check for specific condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(['exports', 'b'], factory);
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && !freeExports.nodeType) {
    // in Node.js or RingoJS v0.8.0+
    if (freeModule) {
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

  exports.test = b.foo;

}));
