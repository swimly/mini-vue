import { ShapeFlags } from "../shared/shapeFlags"

export function initSlots (instance, children) {
  // children object
  const {vnode} = instance
  if (vnode.shapeFlag & ShapeFlags.SLOTCHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }
}

function normalizeSlotValue (value) {
  return Array.isArray(value) ? value : [value]
}

function normalizeObjectSlots (children, slots) {
  for (const key in children) {
    const value = children[key]
    slots[key] = (props) => normalizeSlotValue(value(props))
  }
}