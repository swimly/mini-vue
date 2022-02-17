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
  return createActiveObject(raw, mutableHandlers)
}

/**
 * 创建readonly对象
 * @param raw 
 * @returns 
 */
export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandlers)
}

/**
 * 创建表层readonly对象
 * @param value 
 */
export const shallowReadonly = (raw) => {
  return createActiveObject(raw, shallowReadonlyHandlers)
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

/**
 * 创建响应式对象
 * @param raw 
 * @param baseHandlers 
 * @returns proxy
 */
const createActiveObject = (raw:any, baseHandlers) => {
  return new Proxy(raw, baseHandlers)
}