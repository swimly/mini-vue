import { isObject } from "../shared/index"
import { createComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from "../shared/ShapeFlags"
import { Fragment, Text } from "./vnode"

export function render (vnode, container) {
  patch(vnode, container, null)
}

function patch (vnode, container, parentComponent) {
  //TODO 判断vnode是不是一个element
  const {type, shapeFlag} = vnode
  // fragment -> 之渲染children
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent)
      break;
    case Text:
      processText(vnode, container)
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent)
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent)
      }
      break;
  }
}

function processComponent(vnode: any, container: any, parentComponent) {
  mountComponent(vnode, container, parentComponent)
}
function mountComponent(initialVNode: any, container, parentComponent) {
  const instance = createComponentInstance(initialVNode, parentComponent)
  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance: any, initialVNode, container) {
  const {proxy} = instance
  const subTree = instance.render.call(proxy)
  patch(subTree, container, instance)
  initialVNode.el = subTree.el
}

function processElement(vnode: any, container: any, parentComponent) {
  mountElement(vnode, container, parentComponent)
}

function mountElement(vnode: any, container: any, parentComponent) {
  const {children, props, shapeFlag} = vnode
  const el = (vnode.el = document.createElement(vnode.type))
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent)
  }
  for (const key in props) {
    const val = props[key]
    // 绑定事件
    const isOn = (key) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      const event = key.slice(2).toLocaleLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val) 
    }
  }
  container.append(el)
}

function mountChildren (vnode, container, parentComponent) {
  vnode.children.forEach(v => {
    patch(v, container, parentComponent)
  })
}

function processFragment(vnode: any, container: any, parentComponent) {
  mountChildren(vnode, container, parentComponent)
}
function processText(vnode: any, container: any) {
  const {children} = vnode
  const textNode = (vnode.el = document.createTextNode(children))
  container.append(textNode)
}

