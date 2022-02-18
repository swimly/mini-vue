import {h} from '../../dist/index.esm.js'
import {Foo} from './Foo.js'
window.self = null
const App = {
  name: 'app',
  render () {
    const app = h("div", {}, "App")
    const foo = h(Foo, {}, {
      header: ({age}) => h("p", {}, "header 插槽" + age),
      footer: () => h('p', {}, "footer 插槽")
    })
    return h("div", {}, [app, foo])
  },
  setup () {
    return {}
  }
}

export default App