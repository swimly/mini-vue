import {createRenderer} from '../../dist/index.esm.js'
import App from './App.js'
const canvas = document.createElement('canvas')
canvas.width = 500
canvas.height = 500
document.body.appendChild(canvas)
const renderer = createRenderer({
  createElement (type) {},
  patchProp (el, key, val) {},
  insert (el, parent) {}
})
renderer.createApp(App).mount(canvas)
// const rootContainer = document.querySelector('#app')
// createApp(App).mount(rootContainer)