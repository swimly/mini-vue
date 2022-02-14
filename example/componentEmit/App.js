import {h} from '../../dist/index.esm.js'
import {Foo} from './Foo.js'
window.self = null
const App = {
  name: 'app',
  render () {
    return h("div", {}, [h("div", {}, "App"), h(Foo, {
      onAdd (a, b) {
        console.log('onAdd', a, b)
      },
      onAddFoo (a, b) {
        console.log('onaddfoo', a, b)
      }
    })])
  },
  setup () {
    return {}
  }
}

export default App