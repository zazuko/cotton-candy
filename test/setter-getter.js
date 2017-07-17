/* global describe, it */

const assert = require('assert')
const setterGetter = require('../setter-getter')

describe('setter-getter', () => {
  it('should be a function', () => {
    assert.equal(typeof setterGetter, 'function')
  })

  it('should forward the content', () => {
    assert.equal(setterGetter('content', null, null, {}), 'content')
  })

  it('should attach set and get functions to locals', () => {
    const locals = {}

    setterGetter('content', null, null, locals)

    assert.equal(typeof locals.set, 'function')
    assert.equal(typeof locals.get, 'function')
  })

  it('should not replace existing variables', () => {
    const set = {}
    const get = {}

    const locals = {
      set: set,
      get: get
    }

    setterGetter('content', null, null, locals)

    assert.equal(locals.set, set)
    assert.equal(locals.get, get)
  })

  it('should set should return an empty string', () => {
    const locals = {}

    setterGetter('content', null, null, locals)

    assert.equal(locals.set('test', 'value'), '')
  })

  it('should set should add a new variable to locals', () => {
    const locals = {}

    setterGetter('content', null, null, locals)

    locals.set('test', 'value')

    assert.equal(locals.test, 'value')
  })

  it('should set should replace an existing variable in locals', () => {
    const locals = {
      test: 'old'
    }

    setterGetter('content', null, null, locals)

    locals.set('test', 'new')

    assert.equal(locals.test, 'new')
  })

  it('should get should return the value of the locals variable', () => {
    const locals = {
      test: 'value'
    }

    setterGetter('content', null, null, locals)

    assert.equal(locals.get('test'), 'value')
  })

  it('should get should return undefined for none existing variable', () => {
    const locals = {}

    setterGetter('content', null, null, locals)

    assert.equal(locals.get('test'), undefined)
  })
})
