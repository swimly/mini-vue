class ReactiveEffect {
  private _fn;
  constructor (fn: () => any) {
    this._fn = fn
  }
  public run () {
    this._fn()
  }
}
export function effect (fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}