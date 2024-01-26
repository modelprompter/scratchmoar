const {nodeResolve} = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const {babel} = require('@rollup/plugin-babel')
const vue = require('rollup-plugin-vue')
const replace = require('rollup-plugin-replace')

module.exports = [
  {
    input: 'src/index.js',

    output: {
      name: 'scratchmoar',
      format: 'umd',
      dir: 'dist'
    },

    plugins: [
      vue(),
      replace({
        'process.env.NODE_ENV': JSON.stringify( 'production' )
      }),
      babel({
        babelHelpers: 'runtime',
        plugins: [
          '@babel/plugin-transform-runtime',
          '@babel/plugin-proposal-optional-chaining'
        ]
      }),
      commonjs({include: /node_modules/}),
      nodeResolve()
    ]
  }
]