let activeEffect:any;
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