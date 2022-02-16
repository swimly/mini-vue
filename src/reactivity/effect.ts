// 通过target对象存储的一个Map格式数据
const targetMap = new Map()
// 当前的effet，就是当前ReactiveEffect的实例对象
let activeEffect

/**
 * effect对象，所有的effect实例都是基于此。
 */
class ReactiveEffect {
  private _fn:any; //存储class传进来的fn
  constructor (fn) {
    this._fn = fn  //将class传入的fn赋值给_fn
  }
  public run () {
    activeEffect = this  //将当前实例effect赋值给activeEffect
    return this._fn() //执行class传入的fn
  }
}

/**
 * 
 * @param fn 函数类型
 */
 export function effect (fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
  return _effect.run.bind(_effect)
}

/**
 * 依赖收集
 * @param target 
 * @param key 
 */
 export const track = (target, key) => {
  // target -> key -> dep
  // debugger
  // 通过target从targetMap中查找对应的depsMap
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 如果不存在该target的depsMap便创建一个空的Map并赋值给targetMap的target属性
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  // 获取当前key的dep
  let dep = depsMap.get(key)
  if (!dep) {
    // 如果不存在，便创建一个空的set并赋值给depsMap
    dep = new Set()
    depsMap.set(key, dep)
  }
  // 将当前的effect对象存入dep
  dep.add(activeEffect)
}

/**
 * 触发依赖
 * @param target 
 * @param key 
 */
export const trigger = (target, key) => {
  // debugger
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  //为解决浏览器环境能执行
  dep.forEach((effect) => {
    effect.run()
  })
  // 浏览器环境，下面的方式不会执行
  // for (const effect of dep) {
  //   effect.run()
  // }
}