import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly"
}

export function reactive (raw) {
  return new Proxy(raw, mutableHandlers)
}

export function readonly (raw) {
  return new Proxy(raw, readonlyHandlers)
}

export function isReactive (raw) {
  return !!raw[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly (raw) {
  return !!raw[ReactiveFlags.IS_READONLY]
}