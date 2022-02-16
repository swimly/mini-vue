import {h, createTextVNode} from '../../dist/index.esm.js'
import {Foo} from './Foo.js'
window.self = null
const App = {
  name: 'app',
  render () {
    const app = h("div", {}, "App")
    const foo = h(Foo, {}, {
      header: ({age}) => [h("p", {}, "123" + age), createTextVNode('你好呀')],
      footer: () => h('p', {}, "456")
    })
    return h("div", {}, [app, foo])
  },
  setup () {
    return {}
  }
}

export default App