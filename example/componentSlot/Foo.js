import { h, renderSlots } from "../../dist/index.esm.js"

export const Foo = {
  setup (props, {emit}) {
  },
  render () {
    const foo = h("p", {}, "foo")
    console.log(this.$slots)
    const age = 19
    return h("div", {}, [foo, renderSlots(this.$slots, "footer"), renderSlots(this.$slots, "header", {age: 19})])
  }
}