import {h, getCurrentInstance} from '../../dist/index.esm.js'
import {Foo} from './Foo.js'
window.self = null
const App = {
  name: 'app',
  render () {
    return h("div", {}, [h("p", {}, "currentInstance demo"), h(Foo)])
  },
  setup () {
    const instance = getCurrentInstance()
    console.log("App", instance)
    return {}
  }
}

export default App