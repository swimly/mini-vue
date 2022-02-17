import { track, trigger } from "./effect"
import { ReactiveFlags } from "./reactive"

// 缓存，避免重复执行
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter (isReadonly = false) {
  return function get (target, key) {
    console.log(key)
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key)
    //依赖收集
    if (!isReadonly) {
      track(target, key)
    }
    // 直接返回target中key的值
    return res
  }
}

function createSetter () {
  return function set (target, key, value) {
    // 设置target中key的值为value
    const res = Reflect.set(target, key, value)
    //触发依赖
    trigger(target, key)
    // 返回boolean
    return res
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set (target, key, value) {
    console.warn(`The Object ${JSON.stringify(target)} set the key:${key} with ${value} faild, because it's readonly!`)
    return true
  }
}