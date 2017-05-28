const rollup = require('rollup')
const babel = require('rollup-plugin-babel')

rollup
  .rollup({
    entry: 'src/index.js',
    external: ['core-js/library/fn/object/assign'],
    plugins: [
      babel({
        presets: [
          [
            'env',
            {
              modules: false,
              loose: true,
              targets: { node: 4 }
            }
          ]
        ],
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
