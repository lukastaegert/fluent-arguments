/* eslint-disable tree-shaking/no-side-effects-in-initialization */

const rollup = require('rollup')
const babel = require('rollup-plugin-babel')

rollup
  .rollup({
    entry: 'src/index.js',
    external: ['core-js/library/fn/object/assign'],
    plugins: [
      babel({
        presets: [['latest', { es2015: { modules: false, loose: true } }]],
        plugins: ['external-helpers']
      })
    ]
  })
  .then(bundle => {
    bundle.write({
      dest: 'dist/index.js',
      format: 'cjs'
    })
    bundle.write({
      dest: 'dist/index.mjs',
      format: 'es'
    })
  })
