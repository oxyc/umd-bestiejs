var _ = require('lodash')
  , es = require('event-stream')
  , beautify = require('js-beautify')
  , uglify = require('uglify-js')
  , extend = _.extend
  , fs = require('fs')

var defaultOptions = exports.defaultOptions = {
    amd: true
  , global: true
  , commonjs: true

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

function template(options) {
  var templateFile = fs.existsSync(options.template) ? options.template :
    '../templates/'+ options.template + '.js';

  var source = _.template(fs.readFileSync(templateFile, 'utf-8'))(options);
  if (options.beautify) source = beautify(source, options.beautify);
  if (options.uglify) source = uglify.minify(source, extend(options.uglify, { fromString: true })).code;
  return source.replace(/\s*INSERT\(\)/, '\n\nINSERT()').split('INSERT()');
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
