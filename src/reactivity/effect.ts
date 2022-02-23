let activeEffect:any;
const targetMap = new Map()
class ReactiveEffect {
  private _fn: any
  constructor (fn) {
    this._fn = fn
  }
  public run () {
    activeEffect = this
    this._fn()
  }
}

export function effect (fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

export function track (target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  dep.add(activeEffect)
}

export function trigger (target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  dep.forEach((effect) => {
    effect.run()
  })
}