/* global describe, it */

const assert = require('assert')
const cottonCandy = require('..')

describe('cotton-candy', () => {
  describe('callback API', () => {
    it('should export a factory function', () => {
      assert.equal(typeof cottonCandy, 'function')
    })

    it('should return a render function', () => {
      assert.equal(typeof cottonCandy(), 'function')
    })

    it('should return a render function which calls the callback', (done) => {
      return cottonCandy()('test/support/plain.html', {}, done)
    })
  })

  describe('Promise API', () => {
    it('should export a factory function', () => {
      assert.equal(typeof cottonCandy.promise, 'function')
    })

    it('should return a render function', () => {
      assert.equal(typeof cottonCandy.promise(), 'function')
    })

    it('should return a render function which returns a Promise', () => {
      return cottonCandy.promise()('test/support/plain.html', {})
    })
  })

  describe('render', () => {
    it('should render plain html', () => {
      return cottonCandy.promise()('test/support/plain.html', {}).then((content) => {
        assert.equal(content, '<h1>plain</h1>')
      })
    })

    it('should render html with locals', () => {
      return cottonCandy.promise()('test/support/locals.html', {test: 'test'}).then((content) => {
        assert.equal(content, '<h1>test</h1>')
      })
    })
  })

  describe('resolve', () => {
    it('should support custom resolve', () => {
      const resolve = (filePath) => {
        assert.equal(filePath, 'filePath')

        return 'test/support/plain.html'
      }

      return cottonCandy.promise({resolve: resolve})('filePath', {}).then((content) => {
        assert.equal(content, '<h1>plain</h1>')
      })
    })

    it('should support custom Promise resolve', () => {
      const resolve = (filePath) => {
        assert.equal(filePath, 'filePath')

        return Promise.resolve('test/support/plain.html')
      }

      return cottonCandy.promise({resolve: resolve})('filePath', {}).then((content) => {
        assert.equal(content, '<h1>plain</h1>')
      })
    })
  })

  describe('plugins', () => {
    it('should call plugin with content, options, filePath and locals', () => {
      const plugins = [(content, options, filePath, locals) => {
        assert.equal(content, '<h1>plain</h1>')
        assert.deepEqual(options.plugins, plugins)
        assert.equal(filePath, 'test/support/plain.html')
        assert.equal(locals.test, 'test')

        return content
      }]

      return cottonCandy.promise({plugins: plugins})('test/support/plain.html', {test: 'test'})
    })

    it('should use the returned content', () => {
      const plugins = [(content, options, filePath, locals) => {
        return content.replace('plain', 'replaced')
      }]

      return cottonCandy.promise({plugins: plugins})('test/support/plain.html', {}).then((content) => {
        assert.equal(content, '<h1>replaced</h1>')
      })
    })

    it('should forward render and load function', () => {
      const plugins = [(content, options, filePath, locals) => {
        assert.equal(typeof options.load, 'function')
        assert.equal(typeof options.render, 'function')
      }]

      return cottonCandy.promise({plugins: plugins})('test/support/plain.html', {})
    })
  })
})
