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
    define(['exports'], factory);
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && !freeExports.nodeType) {
    // in Node.js or RingoJS v0.8.0+
    if (freeModule) {
      factory(freeModule.exports);
    }
    // in Narwhal or RingoJS v0.7.0-
    else {
      factory(freeExports);
    }
  }
  // in a browser or Rhino
  else {
    factory((root[name] = {}));
  }
}(this, 'b', function (exports) {

  exports.foo = 'bar';

}));