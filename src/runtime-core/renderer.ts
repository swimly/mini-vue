import { createAppAPI } from "./createApp"
import { EMPTY_OBJ, isObject } from "../shared"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode"
import { effect } from "../reactivity/effect"

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPathProp,
    insert: hostInsert
  } = options

  const render = (vnode, container) => {
    patch(null, vnode, container, null)
  }

  // n1代表老的虚拟dom
  // h2代表新的虚拟dom
  const patch = (n1, n2, container, parentComponent) => {
    // 处理组件
    // TODO 判断vnode是不是一个element
    // processElement()
    const { shapeFlag, type } = n2
    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
        break;
    }
  }

  function processText(n1: any, n2, container) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processFragment(n1: any, n2, container, parentComponent) {
    mountChildren(n2, container, parentComponent)
  }

  function processElement(n1: any, n2, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container)
    }
  }

  function patchElement (n1, n2, container) {
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ
    const el = (n2.el = n1.el)
    patchProps(el, oldProps, newProps)
  }
  function patchProps (el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]
        if (prevProp !== nextProp) {
          hostPathProp(el, key, prevProp, nextProp)
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPathProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  function processComponent(n1: any, n2, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent)
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
      hostPathProp(el, key, null, val)
    }
    // container.append(el)
    hostInsert(el, container)
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(null, v, container, parentComponent)
    })
  }

  function mountComponent(initinalVNode: any, container, parentComponent) {
    const instance = createComponentInstance(initinalVNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initinalVNode, container)
  }

  function setupRenderEffect(instance: any, initinalVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance
        // 获取组件实例的proxy代理对象，并且将render函数的this指向改为proxy，这样在里面调用this的时候会自动指向这个proxy代理对象
        const subTree = (instance.subTree = instance.render.call(proxy))
        patch(null, subTree, container, instance)
        // 所有element都mount
        initinalVNode.el = subTree.el
        instance.isMounted = true
      } else {
        const { proxy } = instance
        // 获取组件实例的proxy代理对象，并且将render函数的this指向改为proxy，这样在里面调用this的时候会自动指向这个proxy代理对象
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        
        // 更新subTree
        instance.subTree = subTree
        patch(prevSubTree,subTree, container, instance)
      }
    })
  }
  return {
    createApp: createAppAPI(render)
  }
}