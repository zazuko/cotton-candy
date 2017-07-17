/* global describe, it */

const assert = require('assert')
const include = require('../include')

describe('include', () => {
  it('should be a function', () => {
    assert.equal(typeof include, 'function')
  })

  it('should not touch a string without includes', () => {
    assert.equal(include('${test}'), '${test}') // eslint-disable-line no-template-curly-in-string
  })

  it('should load files once', () => {
    const content = '${include(\'test/support/plain.html\')}\n${include(\'test/support/plain.html\')}' // eslint-disable-line no-template-curly-in-string

    let loadCount = 0

    const load = (filePath) => {
      loadCount++

      return filePath
    }

    return include(content, {load: load}).then(() => {
      assert.equal(loadCount, 1)
    })
  })

  it('should replace include with file content', () => {
    const content = '${include(\'test/support/plain.html\')}\n${include(\'test/support/plain.html\')}' // eslint-disable-line no-template-curly-in-string

    const load = (filePath) => {
      return filePath
    }

    return include(content, {load: load}).then((content) => {
      assert.equal(content, 'test/support/plain.html\ntest/support/plain.html')
    })
  })
})
