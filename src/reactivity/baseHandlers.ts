import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter (isReadonly = false) {
  return function get (target, key) {
    const res = Reflect.get(target, key)
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter () {
  return function get (target, key, value) {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
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
    console.warn(`The ${key} set to ${value} faild, beacuse the target: ${JSON.stringify(target)} is readonly!`)
    return true
  }
}