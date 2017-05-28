import objectAssign from 'core-js/library/fn/object/assign'

const EXTENDING_ARG_IDENTIFIER = 'X'
const NON_EXTENDING_ARG_IDENTIFIER = 'N'

const extendingPrototype = Object.defineProperty({}, '__FlArg__', {
  value: EXTENDING_ARG_IDENTIFIER
})

const nonExtendingPrototype = Object.defineProperty({}, '__FlArg__', {
  value: NON_EXTENDING_ARG_IDENTIFIER
})

const isFluentArg = arg => arg.__FlArg__
const isExtendingArg = arg => arg.__FlArg__ === EXTENDING_ARG_IDENTIFIER

function getBasicArgObject (setup) {
  const fluentArg = Object.create(
    setup.extendsPrevious ? extendingPrototype : nonExtendingPrototype
  )
  objectAssign(fluentArg, setup.extra)
  return fluentArg
}

export function createArg (setup) {
  if (setup.args) {
    return function () {
      const fluentArg = getBasicArgObject(setup)
      const args = arguments
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
  const result = []
  Array.prototype.slice.call(args).forEach(function (arg) {
    if (isExtendingArg(arg)) {
      const previousArgIndex = Math.max(0, result.length - 1)
      result[previousArgIndex] = objectAssign({}, result[previousArgIndex], arg)
    } else {
      result.push(isFluentArg(arg) ? arg : { value: arg })
    }
  })
  return result
}

export function createFunc (handler) {
  return function () {
    return handler.call(this, parseFluentArgs(arguments))
  }
}
