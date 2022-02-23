let activeEffect:any;
const targetMap = new Map()
class ReactiveEffect {
  private _fn: any
  deps = []
  active = true
  constructor (fn, public scheduler?) {
    this._fn = fn
  }
  public run () {
    activeEffect = this
    return this._fn()
  }
  public stop () {
    if (this.active) {
      cleanUpEffect(this)
      this.active = false
    }
  }
}

function cleanUpEffect (effect) {
  effect.deps.forEach((dep:any) => {
    dep.delete(effect)
  })
}

export function effect (fn, options:any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
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
  if (!activeEffect) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger (target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  dep.forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}

export function stop (runner) {
  runner.effect.stop()
}