import { getCurrentInstance } from ".";

export function provide (key, value) {
  const currentInstance:any = getCurrentInstance()
  if (currentInstance) {
    let {provides} = currentInstance
    const parentProvides = currentInstance.parent.provides
    // 将当前instance的provides指向父级的原型链
    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    provides[key] = value
  }
}

export function inject(key, defaultValue) {
  const currentInstance:any = getCurrentInstance()
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides
    if (key in parentProvides) {
      return parentProvides[key]
    } else {
      if (typeof defaultValue === 'function') {
        return defaultValue()
      }
      return defaultValue
    }
  }
}