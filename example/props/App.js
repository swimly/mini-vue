import { h } from '../../dist/index.esm.js'
import {Foo} from './Foo.js'
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
      [
        h('div', {}, 'hi,' + this.msg),
        h(Foo, {
          count: 1
        })
      ]
    )
  },
  setup() {
    return {
      msg: 'mini-vue'
    }
  }
}
