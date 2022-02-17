import { isObject } from "../shared"
import { createComponentInstance, setupComponent } from "./component"

export const render = (vnode, container) => {
  patch(vnode, container)
}

const patch = (vnode, container) => {
  // 处理组件
  // TODO 判断vnode是不是一个element
  // processElement()
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountElement (vnode: any, container: any) {
  const {children, props} = vnode
  const el = document.createElement(vnode.type)
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, container)
  }
  // props
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }
  container.append(el)
}

function mountChildren (vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container)
  })
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

