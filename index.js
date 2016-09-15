const objectAssign = require('object-assign')

var nonExtendingPrototype = Object.defineProperty({}, '__FlArg__', { value: 'N' })
// var extendingPrototype = Object.defineProperty({}, '__FlArg__', { value: 'X' });

function isFluentArg (arg) {
  return arg.__FlArg__
}

function createArg (setup) {
  if (setup.args) {
    return function () {
      var fluentArg = Object.create(nonExtendingPrototype)
      var args = arguments
      setup.args.forEach(function (arg, index) {
        fluentArg[ arg ] = args[ index ]
      })
      objectAssign(fluentArg, setup.extra)
      return fluentArg
    }
  } else {
    var fluentArg = Object.create(nonExtendingPrototype)
    objectAssign(fluentArg, setup.extra)
    return fluentArg
  }
}

function parseFluentArgs (args) {
  return Array.prototype.slice.call(args)
    .map(function (arg) {
      return isFluentArg(arg) ? arg : { value: arg }
    })
}

function createFunc (handler) {
  return function () {
    return handler.call(this, parseFluentArgs(arguments))
  }
}

module.exports = {
  createArg: createArg,
  createFunc: createFunc
}
