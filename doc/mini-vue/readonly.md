## Readonly

`readonly`其实跟`reactive`是一个原理，都是一个`proxy`对象，只是`readonly`不能被`set`，这样就不会涉及到触发依赖，当然也就不需要去收集依赖。

### 编写单测

下面，还是通过一个单测来了解一下它的功能点。

``` javascript
// src/reactivity/tests/readonly.spec.ts
import {readonly} from '../reactive'
describe("readonly", () => {
  it("happy path", () => {
    const original = {
      foo: 1,
      bar: {
        baz: 2
      }
    }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
  })
})
```

其实`readonly`就仅仅是一个静态响应式对象。

### 编码

`readonly`其实就是一个简版的`reactive`，所以逻辑还是写在`reactive.ts`中。

#### 1、readonly函数

``` javascript
// src/reactivity/reactive.ts
...
export function readonly (raw) {
  return new Proxy(raw, {
    get (target, key) {
      const res = Reflect.get(target,key)
      return res
    },
    set (target, key, value) {
      return true
    }
  })
}
```

导出`readonly`函数，将接收的对象包装成`proxy`对象并且返回。

### 代码优化

实现功能就是这么简单，接下来对我们的代码进行优化，将`reactive.ts`中类似的代码抽离出来，形成通用的，方便后续扩展其他的。

#### 1、将公共代码抽离到`baseHandlers.ts`

将`Proxy`的`handler`全部抽离到一个文件，统一管理，后续再添加也比较方便。

``` javascript
// src/reactivity/baseHandlers.ts
import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter (isReadonly = false) {
  return function get (target, key) {
    const res = Reflect.get(target, key)
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter () {
  return function get (target, key, value) {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}
export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set (target, key, value) {
    return true
  }
}
```

通过创建高阶函数`createGetter`和`createSetter`统一处理`handler`的调配，并通过创建全局变量`get`，`set`，`readonlyGet`存储，避免多次创建。

#### 2、优化`reactive`

基于`baseHandler.ts`导出的`mutableHandlers`和`readonlyHandlers`对`reactive.ts`进行简化

``` javascript
// src/reactivity/reactive.ts
import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export function reactive (raw) {
  return new Proxy(raw, mutableHandlers)
}

export function readonly (raw) {
  return new Proxy(raw, readonlyHandlers)
}
```

这样，我们的代码就重构完了。

### 完善功能

目前已经完成`readonly`的功能，并且在给`readonly`赋值的时候也没有进行任何处理，接下来，我们要实现给`readonly`赋值的时候给用户一个提示。

#### 编写测试用例

``` javascript
// src/reactivity/tests/readonly.spec.ts
describe("readonly", () => {
  ...
  it("warn when call set", () => {
    console.warn = jest.fn()
    const user = readonly({
      age: 10
    })
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})
```

当用户给`readonly`的属性赋值的时候，会执行`console.warn`，给用户一个提示信息。

#### 完善代码

在`readonlyHandler`中的`set`添加一个提示消息。

``` javascript
// src/reactivity/baseHandlers.ts
...
export const readonlyHandlers = {
  ...,
  set (target, key, value) {
    console.warn(`The ${key} set to ${value} faild, beacuse the target: ${JSON.stringify(target)} is readonly!`)
    ...
  }
}

```

### 总结

这一节，先通过`Proxy`创建了一个只处理了`get`请求的响应式对象，也就是我们的`readonly`，后面通过代码重构，将`reactive`和`readonly`相同的代码进行抽离封装，让代码更具可读性和可扩展性，最后给`readonly`处理一下`set`操作的提示消息，上面就是`readonly`的所有功能及代码。

下一节，我们一起来实现`isReactive`和`isReadonly`。