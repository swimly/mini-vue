import { extend } from "../shared";

// 通过target对象存储的一个Map格式数据
const targetMap = new Map()
// 当前的effet，就是当前ReactiveEffect的实例对象
let activeEffect;
// 是否应该收集依赖
let shouldTrack;

/**
 * effect对象，所有的effect实例都是基于此。
 */
class ReactiveEffect {
  private _fn:any; //存储class传进来的fn
  private deps: any[] = [] //存储所有的deps
  public onStop?: () => void
  public active: boolean = true  //防止重复执行stop
  constructor (fn, public scheduler?) {
    this._fn = fn  //将class传入的fn赋值给_fn
  }
  /**
   * 初始化执行
   * @returns 
   */
  public run () {
    // 返回fn执行结果
    // 在这里的时候会收集依赖
    // shouldTrack来做区分
    if (!this.active) {
      // stop状态
      return this._fn() //执行class传入的fn
    }
    shouldTrack = true
    activeEffect = this
    const result = this._fn()
    shouldTrack = false
    return result
  }
  /**
   * 停止触发依赖
   */
  public stop () {
    if (this.active) {
      cleanupEffect(this)
      // 执行onStop回调
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

/**
 * 清空dep容器里的effect
 * @param effect 
 */
const cleanupEffect = (effect) => {
  effect.deps.forEach((dep:any) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

/**
 * 
 * @param fn 函数类型
 */
 export function effect (fn, options:any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options)
  _effect.run()
  // 将当前的run函数返回并改变this指向
  const runner:any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export const isTracking = () => {
  return shouldTrack && activeEffect !== undefined
}

/**
 * 依赖收集
 * @param target 
 * @param key 
 */
 export const track = (target, key) => {
  if(!isTracking()) return
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
  // 上面仅仅为了获取到dep
  trackEffects(dep)
}

/**
 * 收集依赖
 * @param dep 
 * @returns 
 */
export const trackEffects = (dep) => {
  // 将当前的effect对象存入dep
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  // 将所有dep存入activeEffect
  activeEffect.deps.push(dep)
}

/**
 * 当响应式对象改变，触发依赖。
 * @param target 
 * @param key 
 */
export const trigger = (target, key) => {
  // debugger
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  //为解决浏览器环境能执行
  triggerEffect(dep)
  // 浏览器环境，下面的方式不会执行
  // for (const effect of dep) {
  //   effect.run()
  // }
}

/**
 * 调用effect的run函数
 * @param dep 
 */
export const triggerEffect = (dep) => {
  dep.forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}

export const stop = (runner) => {
  runner.effect.stop()
}