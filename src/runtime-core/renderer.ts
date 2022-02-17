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
  // vnode -> element -> div
  const {children, props} = vnode
  const el = (vnode.el = document.createElement(vnode.type))
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el)
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
  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance: any, vnode, container) {
  const {proxy} = instance
  // 获取组件实例的proxy代理对象，并且将render函数的this指向改为proxy，这样在里面调用this的时候会自动指向这个proxy代理对象
  const subTree = instance.render.call(proxy)
  patch(subTree, container)
  // 所有element都mount
  vnode.el = subTree.el
}

