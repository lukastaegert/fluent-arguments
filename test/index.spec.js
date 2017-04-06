/* eslint-env mocha */

var fluentArgs = require('../index')
var createFunc = fluentArgs.createFunc
var createArg = fluentArgs.createArg

var expect = require('chai').expect
var td = require('testdouble')
var verify = td.verify

describe('a fluent argument function', function () {
  var fluentFunc, handler

  beforeEach(function () {
    handler = td.function('handler')
    fluentFunc = createFunc(handler)
  })

  it('should parse regular arguments to values', function () {
    fluentFunc(1, 'a', true, {a: 1})
    verify(handler([{value: 1}, {value: 'a'}, {value: true}, {value: {a: 1}}]))
  })

  it('should forward the return value of the handler', function () {
    td.when(handler([{value: 1}])).thenReturn('myValue')
    expect(fluentFunc(1)).to.equal('myValue')
  })

  it('should call the handler using the right context', function () {
    var myObject = {
      func: createFunc(function () { return this.field }),
      field: 'myField'
    }

    expect(myObject.func()).to.equal('myField')
  })

  describe('handling fluent arguments', function () {
    const dataProvider = [{
      description: 'without parameters or extra data',
      setup: {},
      callParams: null,
      expectedArgs: [{value: 1}, {}]
    }, {
      description: 'without parameters but with extra data',
      setup: {extra: {a: 1, b: 'string', value: true}},
      callParams: null,
      expectedArgs: [{value: 1}, {a: 1, b: 'string', value: true}]
    }, {
      description: 'with parameters but without extra data',
      setup: {args: ['firstArg', 'secondArg']},
      callParams: [1, 2],
      expectedArgs: [{value: 1}, {firstArg: 1, secondArg: 2}]
    }, {
      description: 'with parameters and extra data',
      setup: {args: ['firstArg', 'secondArg'], extra: {a: 1}},
      callParams: [1, 2],
      expectedArgs: [{value: 1}, {firstArg: 1, secondArg: 2, a: 1}]
    }, {
      description: 'extending the previous argument with extra data',
      setup: {extra: {a: 1}, extendsPrevious: true},
      callParams: null,
      expectedArgs: [{value: 1, a: 1}]
    }, {
      description: 'extending the previous argument overwriting a field',
      setup: {extra: {value: 7, a: 1}, extendsPrevious: true},
      callParams: null,
      expectedArgs: [{value: 7, a: 1}]
    }]

    dataProvider.forEach(function (testData) {
      it('should parse a fluent argument ' + testData.description, function () {
        var arg = createArg(testData.setup)
        if (testData.callParams) {
          fluentFunc(1, arg.apply(null, testData.callParams))
        } else {
          fluentFunc(1, arg)
        }
        verify(handler(testData.expectedArgs))
      })
    })
  })

  it('should properly handling using an extending arg as the first argument', function () {
    var fluentArg = createArg({extra: {a: 1}, extendsPrevious: true})
    fluentFunc(fluentArg)
    verify(handler([{a: 1}]))
  })

  it('should properly handle using the same argument twice', function () {
    var fluentArg = createArg({args: ['arg']})
    fluentFunc(fluentArg(1), fluentArg(2))
    verify(handler([{arg: 1}, {arg: 2}]))
  })
})
