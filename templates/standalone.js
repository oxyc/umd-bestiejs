(function (root, name, factory) {
{{#oneof node ringo narwhal browser d8 rhino}}
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };
{{/oneof}}
{{#oneof node ringo narwhal}}
  // Detect free variable `exports`
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
  // Detect free variable `module`
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
{{/oneof}}
{{#oneof node ringo}}
  // Detect the popular CommonJS extension `module.exports`
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
{{/oneof}}
  {{#oneof browser rhino d8}}
  // Detect free variable `global`, from Node.js or Browserified code, and use
  // it as `window`
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }
{{/oneof}}
{{#oneof amd}}
  // some AMD build optimizers, like r.js, check for specific condition
  // patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(['exports'], factory);
  }
{{/oneof}}
{{#oneof node ringo narwhal}}
  {{#oneof amd}}
    // check for `exports` after `define` in case a build optimizer adds an
    // `exports` object
    else if (freeExports && freeModule) {
  {{else}}
    if (freeExports && freeModule) {
  {{/oneof}}
    {{#oneof node ringo}}
        // in Node.js or RingoJS v0.8.0+
        if (moduleExports) {
          factory(freeModule.exports);
        }
      {{#oneof narwhal ringo}}
        // in Narwhal or RingoJS v0.7.0-
        else {
          factory(freeExports);
        }
      {{/oneof}}
    {{else}}
      // in Narwhal or RingoJS v0.7.0-
      factory(freeExports);
    {{/oneof}}
  }
{{/oneof}}
{{#oneof browser d8 rhino}}
  {{#oneof amd node ringo narwhal}}
  // in a browser, D8 or Rhino
  else {
    factory((root[name] = {}));
  }
  {{else}}
    // in a browser, D8 or Rhino
    factory((root[name] = {}));
  {{/oneof}}
{{/oneof}}
}(this, '{{ namespace }}', function (exports) {

  INSERT()
}));
