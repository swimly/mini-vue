import { h } from '../../dist/index.esm.js'
export const App = {
  name: 'app',
  render() {
    return h(
    "div",
      {
        id: 'root',
        class: ['red', 'hard'],
        onClick () {
          console.log('click')
        },
        onMousedown () {
          console.log('mousedown')
        }
      },
      'hi,' + this.msg
    )
  },
  setup() {
    return {
      msg: 'mini-vue'
    }
  }
}
