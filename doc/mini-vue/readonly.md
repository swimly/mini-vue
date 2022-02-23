## Readonly

`readonly`其实跟`reactive`是一个原理，都是一个`proxy`对象，只是`readonly`不能被`set`，这样就不会涉及到触发依赖，当然也就不需要去收集依赖。

### 单测

下面，还是通过一个单测来了解一下它的功能点。

``` javascript
// src/reactivity/tests/readonly.spec.ts
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