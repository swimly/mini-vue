import { isObject } from "../shared/index"
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers"

export const enum ReactiveFlags {
  IS_REACTIVE = '__v-isReactive',
  IS_READONLY = '__v-isReadonly'
}

export function reactive (raw) {
  return createReactiveObject(raw, mutableHandlers)
}

export function readonly (raw) {
  return createReactiveObject(raw, readonlyHandlers)
}

export function shallowReadonly (raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers)
}

export function isReactive (value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly (value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy (value) {
  return isReactive(value) || isReadonly(value)
}


function createReactiveObject (target: any, baseHandlers) {
  if (!isObject(target)) {
    console.warn(`target ${target} 必须是一个对象`)
    return
  }
  return new Proxy(target, baseHandlers)
}