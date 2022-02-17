import { reactive } from "./reactive";
import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffect } from "./effect";

class RefImpl {
  private _value;
  public dep;
  public _rawValue;
  public __v_isRef = true
  constructor (value) {
    // 看value是不是对象
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }
  get value () {
    trackRefValue(this)
    return this._value
  }
  set value (value) {
    if (!hasChanged(value, this._rawValue)) return
    this._rawValue = value
    this._value = convert(value)
    triggerEffect(this.dep)
  }
}

const trackRefValue = (ref) => {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

const convert = (value) => {
  return isObject(value) ? reactive(value) : value
}

export const ref = (value) => {
  return new RefImpl(value)
}

export const isRef = (ref) => {
  return !!ref.__v_isRef
}

export const unRef = (ref) => {
  return isRef(ref) ? ref.value : ref
}

export const proxyRefs = (objectWithRef) => {
  return new Proxy(objectWithRef, {
    get (target, key) {
      return unRef(Reflect.get(target, key))
    },
    set (target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value)
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}