import { createRenderer } from '../runtime-core'
function createElement(type) {
  console.log('createElement -----------------')
  return document.createElement(type)
}

function patchProp(el, key, val) {
  console.log('patchProp -----------------')
  const isOn = (key) => /^on[A-Z]/.test(key)
  if (isOn(key)) {
    const event = key.slice(2).toLocaleLowerCase()
    el.addEventListener(event, val)
  } else {
    el.setAttribute(key, val)
  }
}

function insert(el, parent) {
  console.log('insert -----------------')
  parent.append(el)
}

const renderer:any = createRenderer({
  createElement,
  patchProp,
  insert
}) 

export function createApp (...args) {
  return renderer.createApp(...args)
}

export * from '../runtime-core'