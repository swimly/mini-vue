import {h} from '../../dist/index.esm.js'
import {Foo} from './Foo.js'
window.self = null
const App = {
  name: 'app',
  render () {
    window.self = this
    return h('div', {
      id: 'root',
      class: ['red', 'hard'],
      onClick () {
        console.log('click')
      },
      onMousedown () {
        console.log('down')
      }
    }, 
    // [h('p', {class: 'red'}, 'hi'), h('p', {class: 'blue'}, 'mini-vue'), h('p', {}, `hi,${this.msg}`)]
    [
      h("div", {}, "hi," + this.msg),
      h(Foo, {
        count: 1
      })
    ]
    )
  },
  setup () {
    return {
      msg: 'mini-vue'
    }
  }
}

export default App