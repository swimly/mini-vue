# 实现effect&reactive&依赖收集&触发依赖

## 前置知识

### 什么是Proxy

`Proxy`是Es6定义的一个新的全局构造函数，有两个参数，一个是目标对象，一个是处理程序的对象。

示例

``` javascript
var target = {}
var handler = {}
new Proxy(target, handler)
```

**target**：要使用 `Proxy` 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）

**handler**：一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 `Proxy` 的行为


### 创建 *src/reactivity/reactive.ts*

``` typescript
export default reactive (raw) {
  return new Proxy(raw, {
    get (target, key) {
      const res = Reflect.get(key)
      //TODO 依赖收集
      return res
    },
    set (target, key, value) {
      const res = Reflect.set(target, key, value)
      //TODO 触发依赖
      return false
    }
  })
}
```

这里有`2`个todo，后面再来实现。

### 创建 *src/reactivity/effect.ts*

`effect`是一个函数，接收一个`fn`作为参数。

``` typescript
export function effect (fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run()
}
```

在`effect`内部，我们创建一个`ReactiveEffect`实例对象，并且执行`run`函数。

接下来继续完成`ReactiveEffect`类的代码

``` typescript
class ReactiveEffect {
  private _fn:any;
  constructor (fn) {
    this._fn = fn
  }
  run () {
    this._fn()
  }
}
```

创建一个`ReactiveEffect`类，在构造函数`constructor`中接收传进来的`fn`函数并且赋值，定义一个`run`函数，执行传入进来的`fn`函数。

到这里基本上完成了`reactive`和`effect`的功能。

## 依赖收集

在`src/reactivity/effect.ts`中定义导出`track`函数，接收两个参数，一个是`Proxy`对象的`target`，一个是属性名称`key`。

``` typescript
const targetMap = new Map();
let activeEffect;
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
```