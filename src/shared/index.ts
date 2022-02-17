export const extend = Object.assign

export const isObject = (value) => {
  return value !== null && typeof value === 'object'
}

export const hasChanged = (val, nval) => {
  return !Object.is(val, nval)
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)