const fs = require('fs')
const Promise = require('bluebird')

const readFile = Promise.promisify(fs.readFile)

function load (resolve, filePath) {
  return Promise.resolve().then(() => {
    return resolve(filePath)
  }).then((resolvedFilePath) => {
    return readFile(resolvedFilePath, 'utf-8')
  })
}

function compile (content, args) {
  return Function(args, 'return `' + content + '`') // eslint-disable-line no-new-func
}

function run (content, locals) {
  const keys = Object.keys(locals)
  const values = keys.map(key => locals[key])

  return compile(content, keys).apply(null, values)
}

function render (options, filePath, locals) {
  options = options || {}
  options.plugins = options.plugins || []
  options.resolve = options.resolve || ((p) => p)

  options.load = load.bind(null, options.resolve)
  options.render = render.bind(null, options)

  return options.load(filePath).then((content) => {
    return Promise.reduce(options.plugins, (content, plugin) => {
      return plugin(content, options, filePath, locals)
    }, content)
  }).then((content) => {
    return run(content, locals)
  })
}

function factory (options) {
  return function (filePath, locals, callback) {
    render(options, filePath, locals).asCallback(callback)
  }
}

factory.promise = function (options) {
  return render.bind(null, options)
}

module.exports = factory
