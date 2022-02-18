import { createAppAPI } from "./createApp"
import { isObject } from "../shared"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {

  const {
    createElement: hostCreateElement,
    patchProp: hostPathProp,
    insert: hostInsert
  } = options

  const render = (vnode, container) => {
    patch(vnode, container, null)
  }

  const patch = (vnode, container, parentComponent) => {
    // 处理组件
    // TODO 判断vnode是不是一个element
    // processElement()
    const { shapeFlag, type } = vnode
    // Fragment -> 只渲染 children
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

  function processText(vnode: any, container) {
    const { children } = vnode
    const textNode = (vnode.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processFragment(vnode: any, container, parentComponent) {
    mountChildren(vnode, container, parentComponent)
  }

  function processElement(vnode: any, container: any, parentComponent) {
    mountElement(vnode, container, parentComponent)
  }

  function processComponent(vnode: any, container: any, parentComponent) {
    mountComponent(vnode, container, parentComponent)
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    // vnode -> element -> div
    const { children, props, shapeFlag } = vnode
    const el = (vnode.el = hostCreateElement(vnode.type))
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent)
    }
    // props
    for (const key in props) {
      const val = props[key]
      // const isOn = (key:string) => /^on[A-Z]/.test(key)
      // if (isOn(key)) {
      //   const event = key.slice(2).toLowerCase()
      //   el.addEventListener(event, val)
      // } else {
      //   el.setAttribute(key, val)
      // }
      hostPathProp(el, key, val)
    }
    // container.append(el)
    hostInsert(el, container)
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(v, container, parentComponent)
    })
  }

  function mountComponent(initinalVNode: any, container, parentComponent) {
    const instance = createComponentInstance(initinalVNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initinalVNode, container)
  }

  function setupRenderEffect(instance: any, initinalVNode, container) {
    const { proxy } = instance
    // 获取组件实例的proxy代理对象，并且将render函数的this指向改为proxy，这样在里面调用this的时候会自动指向这个proxy代理对象
    const subTree = instance.render.call(proxy)
    patch(subTree, container, instance)
    // 所有element都mount
    initinalVNode.el = subTree.el
  }
  return {
    createApp: createAppAPI(render)
  }
}