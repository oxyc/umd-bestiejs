var Handlebars = require('handlebars')
  , es = require('event-stream')
  , beautify = require('js-beautify')
  , uglify = require('uglify-js')
  , extend = require('node.extend')
  , fs = require('fs')

var defaultOptions = exports.defaultOptions = {
    amd: true
  // Also supports `browser` and `d8`
  , rhino: true
  // Also supports `d8` and `rhino`
  , browser: true
  // Also supports `node` and `narwhal`
  , ringo: true
  // Also supports `ringo` (v0.8.0+)
  , node: true 
  // Also supports `ringo` (v0.7.0-)
  , narwhal: true
  // Also supports `browser` and `rhino`
  , d8: true
  // Alias of `node`
  , cjs: undefined
  // Alias of `amd`
  , rjs: undefined
  // Alias of `node`
  , browserify: undefined
  // Alias of `node`
  , component: undefined

  // Template to use, can be the path to a template file or one of the
  // predefined templates available.
  , template: 'standalone'
  // Indent the source code to match the UMD patterns nesting level.
  , indent: '  '
  // If truthy `uglify-js` will be used to minify the UMD pattern and this
  // property will be passed as the options object.
  , uglify: false
  // Options to be passed to `js-beautify` while beautifying the UMD pattern.
  , beautify: {
      indent_size: 2
    , preserve_newlines: false
  }
};

Handlebars.registerHelper('requires', function(items, options) {
  return items.map(function(item) {
    return "require('" + options.fn(item) + "')";
  }).join(", ");
});

Handlebars.registerHelper('loads', function(items, options) {
  return items.map(function(item) {
    return "'" + options.fn(item) + ".js'";
  }).join(", ");
});
Handlebars.registerHelper('globals', function(items, options) {
  return items.map(function(item) {
    return "root['" + options.fn(item) + "']";
  }).join(", ");
});

// Conditional checking whether one of the properties evaluates to `true`
Handlebars.registerHelper('oneof', function() {
  var isTrue = false
    , i = 0, l = arguments.length - 1
    , options = arguments[l];

  for (i = 0; i < l; i++) {
    if (arguments[i] !== true) continue;
    isTrue = true;
    break;
  }
  return isTrue ? options.fn(this) : options.inverse(this);
});

function template(options) {
  var templateFile = fs.existsSync(options.template) ? options.template :
    './templates/'+ options.template + '.js';

  var source = Handlebars.compile(fs.readFileSync(templateFile, 'utf-8'))(options);
  if (options.beautify) source = beautify(source, options.beautify);
  if (options.uglify) source = uglify.minify(source, extend(options.uglify, { fromString: true })).code;
  return source.replace(/\s*INSERT\(\)/, '\n\nINSERT()').split('INSERT()');
}

exports.normalizeEngines = normalizeEngines;
function normalizeEngines(options) {
  console.log(options);
  Object.keys(options).forEach(function(key) {
    // Do not normalize disables as the user might not understand the
    // consequences.
    if (options[key] !== true) return;
    switch (key) {
      case 'browser':
      case 'rhino':
      case 'd8':
        options.rhino = true;
        options.d8 = true;
        options.browser = true;
        break;
      case 'amd':
      case 'rjs':
        options.amd = true;
        break;
      case 'cjs':
      case 'component':
      case 'browserify':
        options.node = true;
        break;
    }
  });
}

exports.prelude = prelude;
function prelude(options) {
  return template(options)[0];
}

exports.postlude = postlude;
function postlude(options) {
  return template(options)[1];
}

exports = module.exports = umdify;
function umdify(namespace, options, src) {
  if (typeof options === 'string') {
    src = options;
  } else if (typeof options === 'object' && options !== null) {
    options = extend(defaultOptions, options);
  }
  options.namespace = namespace;
  normalizeEngines(options);

  if (src) {
    if (options.indent) src = src.replace(/(^.)/gm, options.indent + '$1');
    return prelude(options) + src + postlude(options);
  }

  var buffer = []
    // If code is to be indented, buffer it up
    , bufferContent = options.indent
    , first = true;

  function write(chunk) {
    if (bufferContent) buffer.push(chunk);
    // Otherwise just pass it along
    else {
      if (first) this.emit('data', prelude(options));
      first = false;
      this.emit('data', chunk);
    }
  }

  function end() {
    if (first || bufferContent) this.emit('data', prelude(options));
    if (bufferContent) {
      buffer = new Buffer(buffer.join('')).toString();
      // Indent
      if (options.indent) buffer = buffer.replace(/(^.)/gm, options.indent + '$1');
      this.emit('data', buffer);
    }

    this.emit('data', postlude(options));
    this.emit('end');
  }

  return es.through(write, end);
}
