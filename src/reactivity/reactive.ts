import { isObject } from "../shared"
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers"

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

/**
 * 创建响应式对象
 * @param raw 对象，数组，其他
 * @returns proxy
 */
export const reactive = (raw) => {
  return createReactiveObject(raw, mutableHandlers)
}

/**
 * 创建readonly对象
 * @param raw 
 * @returns 
 */
export const readonly = (raw) => {
  return createReactiveObject(raw, readonlyHandlers)
}

/**
 * 创建表层readonly对象
 * @param value 
 */
export const shallowReadonly = (raw) => {
  return createReactiveObject(raw, shallowReadonlyHandlers)
}

/**
 * 判断是否响应式对象
 * @param value 
 * @returns 
 */
export const isReactive = (value) => {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

/**
 * 是否readonly对象
 * @param value 
 * @returns 
 */
export const isReadonly = (value) => {
  return !!value[ReactiveFlags.IS_READONLY]
}

export const isProxy = (value) => {
  return isReactive(value) || isReadonly(value)
}

/**
 * 创建响应式对象
 * @param raw 
 * @param baseHandlers 
 * @returns proxy
 */
const createReactiveObject = (target:any, baseHandlers) => {
  if (!isObject(target)) {
    console.warn(`target must be a object`)
    return target
  }
  return new Proxy(target, baseHandlers)
}