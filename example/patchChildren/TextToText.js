import {ref, h} from '../../dist/index.esm.js'

const nextChildren = 'newChildren'
const prevChildren = 'oldChild'

export default {
  name: "ArrayToText",
  setup () {
    const isChange = ref(false)
    window.isChange1 = isChange
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