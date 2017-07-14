const Promise = require('bluebird')

const regexString = '\\${include\\(\'(.*)\'\\)}' // eslint-disable-line no-template-curly-in-string
const regexAll = new RegExp(regexString, 'g')
const regexFilePath = new RegExp(regexString)

function include (content, options, filePath, locals) {
  const matches = content.match(regexAll)

  if (!matches) {
    return content
  }

  const uniqueMatches = matches.filter((v, i, a) => a.indexOf(v) === i)

  return Promise.all(uniqueMatches.map((match) => {
    const filePath = match.match(regexFilePath).pop()

    return options.render(filePath, locals)
  })).then((includesContent) => {
    return includesContent.reduce((content, includeContent, index) => {
      return content.split(uniqueMatches[index]).join(includeContent)
    }, content)
  })
}

module.exports = include
