import typescript from '@rollup/plugin-typescript'
export default {
  input: './src/index.ts',  //入口
  output: [{
    file: 'dist/index.cjs.js',
    format: 'cjs'
  }, {
    file: 'dist/index.esm.js',
    format: 'es'
  }],
  plugins: [
    typescript()
  ]
}