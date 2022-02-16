import { track, trigger } from "./effect"

/**
 * 创建响应式对象
 * @param raw 对象，数组，其他
 * @returns proxy
 */
export const reactive = (raw) => {
  return new Proxy(raw, {
    get (target, key) {
      const res = Reflect.get(target, key)
      //依赖收集
      track(target, key)
      // 直接返回target中key的值
      return res
    },
    set (target, key, value) {
      // 设置target中key的值为value
      const res = Reflect.set(target, key, value)
      //触发依赖
      trigger(target, key)
      // 返回boolean
      return res
    }
  })
}