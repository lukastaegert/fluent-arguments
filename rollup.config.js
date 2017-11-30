/* eslint-disable tree-shaking/no-side-effects-in-initialization */

import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  external: ['core-js/library/fn/object/assign'],
  plugins: [
    babel({
      presets: [
        [
          'env',
          {
            modules: false
          }
        ]
      ],
      plugins: ['external-helpers']
    })
  ],
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs'
    },
    {
      file: 'dist/index.mjs',
      format: 'es'
    }
  ]
}
