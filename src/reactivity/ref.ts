import { isTracking, trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"
import { hasChanged, isObject } from "../shared/index"

class RefImpl {
  private _value: any
  public dep
  private _rawValue: any
  public __v_isRef: boolean = true
  constructor (value) {
    this._rawValue = value
    this._value = convert(value)
    // 判断value是否是对象
    
    this.dep = new Set()
  }
  get value () {
    trackRefValue(this)
    return this._value
  }
  set value (value) {
    if (!hasChanged(value, this._rawValue)) return
    this._value = convert(value)
    this._rawValue = value
    console.log('应该执行1')
    triggerEffects(this.dep)
  }
}

function convert (value) {
  return isObject(value) ? reactive(value) : value
}

export function trackRefValue (ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

export function ref (value) {
  return new RefImpl(value)
}

export function isRef (ref) {
  return !!ref.__v_isRef
}

export function unRef (ref) {
  return isRef(ref) ? ref.value : ref
}

export function proxyRefs (objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get (target, key) {
      return unRef(Reflect.get(target, key))
    },
    set (target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return target[key].value = value
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}