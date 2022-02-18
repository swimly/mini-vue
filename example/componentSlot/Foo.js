import { h, renderSlots } from "../../dist/index.esm.js"

export const Foo = {
  setup (props, {emit}) {
    return {}
  },
  render () {
    const foo = h("p", {}, "foo")
    const age = 18
    return h("div", {}, [
      renderSlots(this.$slots, "footer"),
      foo,
      renderSlots(this.$slots, "header", {age})])
  }
}