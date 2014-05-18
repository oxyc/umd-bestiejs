# UMD BestieJS

> _Note this is **not** a BestieJS module._
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

## Installation

@TODO

```sh
$ npm install -g umd-bestiejs
```

## Usage

Using [Node.js][node]

```js
var umdify = require('umd-bestiejs');
var contents = umdify('foobar', { amd: false }, 'exports.foo = "bar";');
console.log(contents);
```

Using [Node.js][node] with streams

```js
var umdify = require('umd-bestiejs');
process.stdin.pipe(umdify('foobar', { amd: false })).pipe(process.stdout);
```

Command line
```sh
umdify --no-amd foobar foobar.js
```

## Options

- `amd: true`<br>
  Support AMD
- `global: true`<br>
  Support browsers, `d8` and `rhino`
- `commonjs: true`<br>
  Support CommonJS environments (Node.js, `ringo`, `rhino -require`, `narwhal`, `browserify` and `component`)
- `template: 'standalone'`<br>
  Template to use, can be the path to a template file or one of the predefined templates available.
- `indent: '  '`<br>
  Indent the source code to match the UMD patterns nesting level.
- `uglify: false`<br>
  If truthy `uglify-js` will be used to minify the UMD pattern and this property will be passed as the options object.
- `beautify: { indent_size: 2, preserve_newlines: false }`<br>
Options to be passed to `js-beautify` while beautifying the UMD pattern.

## `umdify(1)`

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
  --[no]-global
  --[no]-amd
  --[no]-commonjs
```

## Examples

```sh
$ echo "exports.foobar = 'baz';" > foobar.js
$ umdify foobar foobar.js
```

```js
(function(root, name, factory) {
  // Used to determine if values are of the language type `Object`
  var objectTypes = {
    'function': true,
    'object': true
  };
  // Used as a reference to the global object
  var root = (objectTypes[typeof window] && window) || this;
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

  // some AMD build optimizers, like r.js, check for specific condition
  // patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(['exports'], factory);
  }
  // check for `exports` after `define` in case a build optimizer adds an
  // `exports` object
  else if (freeExports && freeModule) {
    // in Node.js, Ringo, and Narwhal
    factory(freeExports);
  } else {
    // in a browser, D8 or Rhino
    factory(root[name] = {});
  }
}('foo', function(exports) {

  exports.foobar = 'baz;'

}));
```

## License

MIT

[node]: http://nodejs.org/
[component]: http://component.io/
[browserify]: http://browserify.org/
[d8]: http://code.google.com/p/v8/
[ringo]: http://ringojs.org
[rhino]: https://developer.mozilla.org/en-US/docs/Rhino
[narwhal]: https://github.com/280north/narwhal
[rjs]: http://requirejs.org/docs/optimization.html
