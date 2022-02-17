import { shallowReadonly } from ".."
import { initProps } from "./componentProps"
import { publicInstanceProxyHandlers } from "./componentPublicInstance"

export const createComponentInstance = (vnode) => {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {}
  }
  return component
}

export const setupComponent = (instance) => {
  // 初始化props
  initProps(instance, instance.vnode.props)
  // initSlots()
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
    const setupResult = setup(shallowReadonly(instance.props)) //setup返回的函数或者object
    handleSetupResult(instance, setupResult)
  }
}
function handleSetupResult(instance, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  instance.render = Component.render
}

