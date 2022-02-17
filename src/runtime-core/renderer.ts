import { createComponentInstance, setupComponent } from "./component"

export const render = (vnode, container) => {
  patch(vnode, container)
}

const patch = (vnode, container) => {
  // 处理组件
  processComponent(vnode, container)
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}
function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container) {
  const subTree = instance.render()
  patch(subTree, container)
}

