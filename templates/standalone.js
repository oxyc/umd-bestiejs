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

<% if (amd) { %>
  // some AMD build optimizers, like r.js, check for specific condition
  // patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(['exports'], factory);
  }
<% } %>
<% if (commonjs) { %>
  <% if (amd) { %>
  // check for `exports` after `define` in case a build optimizer adds an
  // `exports` object
  else<% } %> if (freeExports && freeModule) {
    // in Node.js, Ringo, and Narwhal
    factory(freeExports);
  }
<% } %>
<% if (global) { %>
  <% if (commonjs || amd) { %>else {<% } %>
  // in a browser, D8 or Rhino
  factory(root[name] = {});
  <% if (commonjs || amd) { %>}<% } %>
<% } %>
}('<%= namespace %>', function (exports) {

INSERT()
}));
