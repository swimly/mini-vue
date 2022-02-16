import { h, getCurrentInstance } from "../../dist/index.esm.js"

export const Foo = {
  name: 'foo',
  setup () {
    const instance = getCurrentInstance()
    console.log('Foo:', instance)
    return {}
  },
  render () {
    return h("div", {}, "foo")
  }
}