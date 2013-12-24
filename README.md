UMD BestieJS
============

> _Note this is NOT a BestieJS module._
>
> Truly *Universal* Module Definition pattern developed by [BestieJS](https://github.com/bestiejs)
> and modified into an [Universal Module Definition](https://github.com/umdjs/umd) pattern by oxyc.
>
> Thanks to the BestieJS pattern a series of environments and build systems are
> supported and tested in this repository:

- [Node.js][node]
- [Rhino][rhino]
- [RingoJS][ringo]
- [Narwhal][narwhal]
- [D8][d8]
- [Browserify][browserify]
- [Component][component]
- [r.js][rjs]
- AMD loaders
- Browsers
- Leaked `exports`

Much of the build functionality is inspired by
[ForbesLindesay/umd](https://github.com/ForbesLindesay/umd) and might be merged
into that repository at a later stage.

Installation
------------

@TODO

Usage
-----

Node

```js
var umdify = require('umd-bestiejs');
var contents = umdify('foobar', { amd: false }, 'exports.foo = "bar";');
console.log(contents);
```

Node streams

```js
var umdify = require('umd-bestiejs');
process.stdin.pipe(umdify('foobar', { amd: false })).pipe(process.stdout);
```

Command line
```sh
umdify --no-amd foobar foobar.js
```

Options
-------

- `amd: true` Support AMD
- `rhino: true` Support [rhino][rhino] engine (also supports `browser` and `d8`
- `browser: true` Support browsers (also supports `d8` and `rhino`)
- `ringo: true` Support [RingoJS][ringo] engine (also supports `node` and `narwhal`)
- `node: true` Support [Node.js][node] (also supports `ringo` v0.8.0+)
- `narwhal: true` Support [Narwhal][narwhal] engine (also supports `ringo` v0.7.0-)
- `d8: true` Support [D8][d8] (also supports `browser` and `rhino`)
- `cjs: undefined` Support CommonJS (alias of `node`)
- `rjs: undefined` Support [r.js][rjs] (alias of `amd`)
- `browserify: undefined` Support [Browserify][browserify] (alias of `node`)
- `component: undefined` Support [Component][component] (alias of `node`)
- `template: 'standalone'` Template to use, can be the path to a template file or one of the predefined templates available.
- `indent: '  '` Indent the source code to match the UMD patterns nesting level.
- `uglify: false` If truthy `uglify-js` will be used to minify the UMD pattern and this property will be passed as the options object.
- `beautify: { indent_size: 2, preserve_newlines: false }` Options to be passed to `js-beautify` while beautifying the UMD pattern.


umdify(1)
---------

```sh
$ umdify --help

Usage: umdify [option]... <name> <source>...

Options:
  -t|--template
  --[no]-uglify
  --[no]-indent
  -v|--version
  -h|--help

Engines:
  --[no]-ringo
  --[no]-rhino
  --[no]-node
  --[no]-narwhal
  --[no]-browser
  --[no]-d8
  --[no]-amd
  --[no]-rjs
  --[no]-cjs
  --[no]-component
  --[no]-browserify
```

Examples
--------

```sh
$ echo "exports.foobar = 'baz';" > foobar.js
$ umdify foobar foobar.js
```

```js
(function(root, name, factory) {
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
    define(['exports'], factory);
  }
  // check for `exports` after `define` in case a build optimizer adds an
  // `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS v0.8.0+
    if (moduleExports) {
      factory(freeModule.exports);
    }
    // in Narwhal or RingoJS v0.7.0-
    else {
      factory(freeExports);
    }
  }
  // in a browser, D8 or Rhino
  else {
    factory((root[name] = {}));
  }
}(this, 'foobar', function(exports) {

  exports.foobar = 'baz';

}));
```

License
-------

MIT

[node]: http://nodejs.org/
[component]: http://component.io/
[browserify]: http://browserify.org/
[d8]: http://code.google.com/p/v8/
[ringo]: http://ringojs.org
[rhino]: https://developer.mozilla.org/en-US/docs/Rhino
[narwhal]: https://github.com/280north/narwhal
[rjs]: http://requirejs.org/docs/optimization.html
