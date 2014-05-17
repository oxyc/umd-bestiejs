(function (name, factory) {
<% if (commonjs || global) { %>
  // Used to determine if values are of the language type `Object`
  var objectTypes = {
    'function': true,
    'object': true
  };
<% } %>
  // Used as a reference to the global object
  var root = (objectTypes[typeof window] && window) || this;
<% if (commonjs) { %>
  // Detect free variable `exports`
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
  // Detect free variable `module`
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
  // Detect free variable `global`, from Node.js or Browserified code, and use
  // it as `window`
  var freeGlobal = freeExports && freeModule && objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }
<% } %>

  // some AMD build optimizers, like r.js, check for specific condition
  // patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(['exports', 'umd-standalone'], factory);
  }
  // check for `exports` after `define` in case a build optimizer adds an
  // `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS v0.8.0+
    factory(freeExports, {{#requires dependencies}}{{ path }}{{/requires}});
  }
  // in a browser, Rhino or D8
  else {
    // Rhino or D8
    if (typeof load == 'function') {
      // modules are sourced and not returned. The path should be relative to
      // the executing script, in this case from `test/`
      load([{{#loads dependencies}}{{ path }}{{/loads}}]);
    }
    factory((root[name] = {}), {{#globals dependencies}}{{ name }}{{/globals}});
  }
}('<%= namespace %>', function (exports, b) {

{{{ script }}}

}));
