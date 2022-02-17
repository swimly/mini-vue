import { h } from '../../dist/index.esm.js'
const App = {
  name: 'app',
  render() {
    return h("div", {}, "hi," + this.msg)
  },
  setup() {
    return {
      msg: 'mini-vue'
    }
  }
}

export default App