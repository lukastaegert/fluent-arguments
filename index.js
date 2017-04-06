var objectAssign = require('object-assign')

var EXTENDING_ARG_IDENTIFIER = 'X'
var NON_EXTENDING_ARG_IDENTIFIER = 'N'
var extendingPrototype = Object.defineProperty({}, '__FlArg__', {value: EXTENDING_ARG_IDENTIFIER})
var nonExtendingPrototype = Object.defineProperty({}, '__FlArg__', {value: NON_EXTENDING_ARG_IDENTIFIER})

function isFluentArg (arg) {
  return arg.__FlArg__
}

function isExtendingArg (arg) {
  return arg.__FlArg__ === EXTENDING_ARG_IDENTIFIER
}

function getBasicArgObject (setup) {
  var fluentArg = Object.create(setup.extendsPrevious ? extendingPrototype : nonExtendingPrototype)
  objectAssign(fluentArg, setup.extra)
  return fluentArg
}

function createArg (setup) {
  if (setup.args) {
    return function () {
      var fluentArg = getBasicArgObject(setup)
      var args = arguments
      setup.args.forEach(function (arg, index) {
        fluentArg[arg] = args[index]
      })
      return fluentArg
    }
  } else {
    return getBasicArgObject(setup)
  }
}

function parseFluentArgs (args) {
  var result = []
  Array.prototype.slice.call(args).forEach(function (arg) {
    if (isExtendingArg(arg)) {
      var previousArgIndex = Math.max(0, result.length - 1)
      result[previousArgIndex] = objectAssign({}, result[previousArgIndex], arg)
    } else {
      result.push(isFluentArg(arg) ? arg : {value: arg})
    }
  })
  return result
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
