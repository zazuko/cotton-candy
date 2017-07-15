function setterGetter (content, options, filePath, locals) {
  if (!locals.set) {
    locals.set = (key, value) => {
      locals[key] = value

      return ''
    }
  }

  if (!locals.get) {
    locals.get = (key) => {
      return locals[key]
    }
  }

  return content
}

module.exports = setterGetter
