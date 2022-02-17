import { h } from '../../dist/index.esm.js'
export const App = {
  name: 'app',
  render() {
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
