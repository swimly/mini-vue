import { createVNode } from "./vnode"

export function createAppAPI (render) {
  return function createApp (rootComponent) {
    return {
      mount (rootContainer) {
        // 将所有的转换成VNode
        const vnode = createVNode(rootComponent)
        render(vnode, rootContainer)
      }
    }
  }
}
