import {ref, h} from '../../dist/index.esm.js'

const prevChildren = 'oldChild'
const nextChildren = [
  h("div", {}, 'A'),
  h("div", {}, "B")
]

export default {
  name: "ArrayToText",
  setup () {
    const isChange = ref(false)
    window.isChange2 = isChange
    return {
      isChange
    }
  },
  render () {
    const self = this
    return self.isChange === true
    ? h("div", {}, nextChildren)
    : h('div', {}, prevChildren)
  }
}