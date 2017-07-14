const fs = require('fs')
const Promise = require('bluebird')

const readFile = Promise.promisify(fs.readFile)

function compile (content, args) {
  return Function(args, 'return `' + content + '`') // eslint-disable-line no-new-func
}

function render (options, filePath, locals) {
  options = options || {}
  options.plugins = options.plugins || []
  options.resolve = options.resolve || ((p) => p)

  options.render = render.bind(null, options)

  const keys = Object.keys(locals)
  const values = keys.map(key => locals[key])

  return Promise.resolve().then(() => {
    return options.resolve(filePath)
  }).then((resolvedFilePath) => {
    return readFile(resolvedFilePath, 'utf-8')
  }).then((content) => {
    return Promise.reduce(options.plugins, (content, plugin) => {
      return plugin(content, options, filePath, locals)
    }, content)
  }).then((content) => {
    return compile(content, keys).apply(null, values)
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
