## Runner

我们已经完成了响应式的整个流程，并已经达到数据改变的时候相关值也会跟着变化，今天我们就来处理一下`effect`函数的返回，之前，我们仅仅处理了如何调用`effect`传入的`fn`。

### 单测

接下来，我们还是看一个单测，便于我们了解什么是我们所说的`runner`。

``` javascript
// src/reactivity/effect.spec.ts
describe("effect", () => {
  ...
  it ('should return runner when call effect', () => {
    let foo = 10
    // 将effect执行完之后返回的值赋值给runner
    const runner = effect(() => {
      foo ++
      return 'foo'
    })
    expect(foo).toBe(11)
    // 从这里，我们知道effect返回的是一个function，并且也有返回值
    const r = runner()
    // 到这一步，我们知道执行runner之后数值会更新，这个runner就是我们传入effect的fn
    expect(foo).toBe(12)
    expect(r).toBe('foo')
  })
})
```

我们一起来分析上面的测试用例，从中我们可以得到3条信息

- 1、`effect`执行结果会返回一个`function`，我们称之为`runner`。

- 2、我们可以接收`runner`返回的值，也就是说我们可以获取`effect(fn)`中`fn`的返回值

- 3、当我们执行`runner`的时候，会再次执行`fn`函数
  
### 编码

根据上面的结论，我们开始一步步来实现。

#### 1、处理`effect`的返回值

这里，我们之所以要用`bind`指定`_effect.run`函数的`this`指向，是因为在`ReactiveEffect`的`run`方法中，我们将`this`赋值给了`activeEffect`，为了避免`this`指向出问题。

``` javascript
export function effect (fn) {
  ...
  return _effect.run.bind(effect)
}
```

#### 2、处理`ReactiveEffect`中返回值

我们直接在`run`中返回`this._fn()`的执行结果即可。

``` javascript
class ReactiveEffect {
  ...
  public run () {
    activeEffect = this
    return this._fn()
  }
}
```

上面就是所有关于`runner`的的代码

### 测试结果

``` bash
PS D:\user\desktop\mini-vue> yarn test
yarn run v1.22.10
$ jest
 PASS  src/reactivity/tests/effect.spec.ts
 PASS  src/reactivity/tests/reactive.spec.ts
 PASS  src/reactivity/tests/index.spec.ts

Test Suites: 3 passed, 3 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.988 s, estimated 1 s
Ran all test suites.
Done in 2.21s.
```

### 总结

这里，我们可能还不大了解`runner`到底有啥用处，到了后面会慢慢理解，我们先理解`runner`的逻辑实现，以及他能干什么即可。