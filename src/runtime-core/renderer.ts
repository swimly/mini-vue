import { isObject } from "../shared"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"

export const render = (vnode, container) => {
  patch(vnode, container)
}

const patch = (vnode, container) => {
  // 处理组件
  // TODO 判断vnode是不是一个element
  // processElement()
  const {shapeFlag} = vnode
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container)
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
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
  const {children, props, shapeFlag} = vnode
  const el = (vnode.el = document.createElement(vnode.type))
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }
  // props
  for (const key in props) {
    const isOn = (key:string) => /^on[A-Z]/.test(key)
    const val = props[key]
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }
  container.append(el)
}

function mountChildren (vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container)
  })
}

function mountComponent(initinalVNode: any, container) {
  const instance = createComponentInstance(initinalVNode)
  setupComponent(instance)
  setupRenderEffect(instance, initinalVNode, container)
}

function setupRenderEffect(instance: any, initinalVNode, container) {
  const {proxy} = instance
  // 获取组件实例的proxy代理对象，并且将render函数的this指向改为proxy，这样在里面调用this的时候会自动指向这个proxy代理对象
  const subTree = instance.render.call(proxy)
  patch(subTree, container)
  // 所有element都mount
  initinalVNode.el = subTree.el
}

