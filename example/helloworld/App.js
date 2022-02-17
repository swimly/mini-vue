import { h } from '../../dist/index.esm.js'
window.self = null
export const App = {
  name: 'app',
  render() {
    window.self = this
    return h("div", {id: 'root', class: ['red', 'hard']}, [
      // h("p", {class: 'red'}, 'red, mini-vue'),
      // h("p", {class: 'blue'}, 'blue, mini-vue')
      h("div", {}, `hi，` + this.msg)
    ])
  },
  setup() {
    return {
      msg: 'mini-vue'
    }
  }
}
