import { render } from "./renderer"
import { createVNode } from "./vnode"

export const createApp = (rootComponent) => {
  return {
    mount (rootContainer) {
      // 将所有的转换成VNode
      const vnode = createVNode(rootComponent)
      render(vnode, rootContainer)
    }
  }
}