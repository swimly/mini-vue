import { proxyRefs, shallowReadonly } from ".."
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { publicInstanceProxyHandlers } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"

let currentInstance = null

export const createComponentInstance = (vnode, parent) => {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    subTree: {},
    emit: () => {}
  }
  component.emit = emit.bind(null, component) as any
  return component
}

export const setupComponent = (instance) => {
  // 初始化props
  initProps(instance, instance.vnode.props)
  // 初始化slot
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type
  // 通过给组件实例挂载一个proxy，并且再render中指定this为proxy，当render中调用this.XX的时候就会执行下面的get方法，在下面返回setupState的值即可。
  instance.proxy = new Proxy({
    _: instance
  }, publicInstanceProxyHandlers)
  const {setup} = Component
  if (setup) {
    setCurrentInstance(instance)
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    }) //setup返回的函数或者object
    setCurrentInstance(null)
    handleSetupResult(instance, setupResult)
  }
}
function handleSetupResult(instance, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult)
  }
  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  instance.render = Component.render
}

export function getCurrentInstance () {
  return currentInstance
}

export function setCurrentInstance (instance) {
  currentInstance = instance
}