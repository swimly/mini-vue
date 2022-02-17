import { mutableHandlers, readonlyHandlers } from "./baseHandlers"

/**
 * 创建响应式对象
 * @param raw 对象，数组，其他
 * @returns proxy
 */
export const reactive = (raw) => {
  return createActiveObject(raw, mutableHandlers)
}

export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandlers)
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