export const extend = Object.assign

export const isObject = (value) => {
  return value !== null && typeof value === 'object'
}

export const hasChanged = (val, nval) => {
  return !Object.is(val, nval)
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

export const camelize = (str:string) => str.replace(/-(\w)/g, (_, c:string) => {
  return c ? c.toUpperCase() : ''
})

const capitalize = (str:string) => str.charAt(0).toUpperCase() + str.slice(1)

export const toHandlerKey = (str: string) => str ? 'on' + capitalize(str) : ''