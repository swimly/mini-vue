import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [{
    file: pkg.main,
    format: 'cjs'
  }, {
    file: pkg.module,
    format: 'es'
  }],
  plugins: [
    typescript(),
    babel({
      extensions: ['.ts'],
      babelHelpers: 'bundled',
      presets: [
        '@babel/preset-env'
      ]
    })
  ]
}