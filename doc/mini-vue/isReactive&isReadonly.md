## isReadonly和isReadonly

前面我们已经实现了`reactive`和`readonly`，这一节，我们来实现两个方法`isReactive`和`isReadonly`，用来判断一个对象是否是`reactive`和`readonly`对象。

### 编写测试

首先，我们先来完善一下测试用例

#### 编写`isReactive`测试

``` javascript
// src/reactivity/tests/reactive.spec.ts
import {reactive, isReactive} from '../reactive'
describe("reactive", () => {
  it("happy path", () => {
    ...
    expect(isReactive(obj)).toBe(true)
    expect(isReactive(origin)).toBe(false)
  })
})
```

#### 编写`isReadonly`测试

``` javascript
// src/reactivity/tests/readonly.spec.ts
describe("readonly", () => {
  it("happy path", () => {
    ...
    expect(isReadonly(wrapped)).toBe(true)
  })
  ...
})
```

其实功能很简单，就是通过传入的对象来判断是不是响应式对象和只读响应式对象。

### 编码

根据上一节，我们抽离的公共`handler`可以看到，我们在`createGetter`的时候其实已经做了区分，通过`isReadonly`参数就可以知道当前对象是什么类型，所以，接下来我们只需要触发对象的`get`操作，我们就可以知道当前对象的类型。

#### 1、实现isReactive

``` javascript
// src/reactivity/reactive.ts
export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive"
}
...
export function isReactive (raw) {
  return !!raw[ReactiveFlags.IS_REACTIVE]  // !!是将undefined转换成boolean
}
```

这样，当我们执行`isReactive(value)`的时候就会调用`value`的get请求（`value.__v_isReactive`），接下来，我们在`reactive`的`get`请求里对他进行返回即可

``` javascript
// src/reactivity/baseHandlers.ts
import { ReactiveFlags } from "./reactive"
function createGetter (isReadonly = false) {
  return function get (target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    ...
  }
}
```

到此，`isReactive`就完成了，其实`isReadonly`原理一样，下面就一步步来实现`isReadonly`的逻辑

#### 1、实现isReadonly

参考isReactive的实现思路，isReadonly同理。

``` javascript
// src/reactivity/reactive.ts
export const enum ReactiveFlags {
  ...,
  IS_READONLY = "__v_isReadonly"
}
...
export function isReadonly (raw) {
  return !!raw[ReactiveFlags.IS_READONLY]
}
```

``` javascript
// src/reactivity/baseHandlers.ts
function createGetter (isReadonly = false) {
  return function get (target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      ...
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    ...
  }
}
```

### 总结

通过调用对象的`get`方法，获取对象指定的属性，这里我们通过`enum`创建了一个枚举，方便统一管理属性名称，最后在`createGetter`中判断`key`的名称，进行返回。