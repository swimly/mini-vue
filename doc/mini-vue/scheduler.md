## Scheduler

在开始编写功能之前，我们先一起来看一下什么是`scheduler`，下面是从`vue3`中拷贝的`单测`。

### 单测

要了解一下功能点，最好的方式就是读懂单测。

``` javascript
// src/reactivity/effect.spec.ts
describe("effect", () => {
  ...
  it("scheduler", () => {
    let dummy;
    let run:any;
    // 定义一个jest函数
    const scheduler = jest.fn(() => {
      run = runner
    })
    // 创建一个响应式对象
    const obj = reactive({foo: 1})
    // 将effect的返回值也就是runner赋值给runner
    const runner = effect(() => {
      dummy = obj.foo
    }, {scheduler})
    // 这时候scheduler函数并未执行
    expect(scheduler).not.toHaveBeenCalled()
    // 默认执行了effect第一个参数fn，所以dummy为1
    expect(dummy).toBe(1)
    // 再次更新响应式对象的值
    obj.foo++;
    // 这时候执行的是scheduler，并未执行fn，所以dummy并不会同步更新
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    // 执行run()的时候便是执行上面的fn函数，这在上一节有讲到
    run()
    // 这时候dummy的值才会更新
    expect(dummy).toBe(2)
  })
})
```

从上面的单测中，我们可以知道`schedule`是作为`effect`的第二个参数传入的，当执行`effect(fn, {scheduler})`的时候，并不会立马执行`scheduler`函数，而是当响应式对象属性改变的时候才会去执行`scheduler`，而不会去执行`fn`，而且此时`dummy`的值并未改变，当再次执行`run`函数的时候，`dummy`才会再次更新。

### 编码

废话已经讲了太多，直接开干。

#### 1、修改`effect`函数

作为`effect`的入口，我们先给`effect`多加一个参数`options`，而`scheduler`是它的一个参数，有人可能会问，为啥不直接在第二个参数传入`scheduler`，当然为了后续传入更多的参数。

``` javascript
export function effect (fn, options:any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  ...
}
```

#### 2、修改`ReactiveEffect`类

在`effect`中，我们给`new ReactiveEffect(fn, scheduler)`，传入了第二个参数，当然，我们也要改下这个类。

``` javascript
class ReactiveEffect {
  constructor(fn, public scheduler?) {
    ...
  }
  ...
}
```
你没看错，我们只用加上`public scheduler?`，这里加问号，是因为这个参数也可以不传。

#### 3、修改`trigger`逻辑

上面，我们已经给`ReactiveEffect`添加了一个新的属性`scheduler`，而且这个属性可能没有，接下来，我们就来改下触发依赖的时候，如果`scheduler`存在，我们就执行它，如果没有我们就还是执行`fn`。

``` javascript
export function trigger (target, key) {
  ...
  dep.forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}
```

上面便是我们实现`scheduler`的所有流程及代码。


### 测试结果

``` bash
PS D:\user\desktop\mini-vue> yarn test
yarn run v1.22.10
$ jest
 PASS  src/reactivity/tests/effect.spec.ts
 PASS  src/reactivity/tests/index.spec.ts
 PASS  src/reactivity/tests/reactive.spec.ts

Test Suites: 3 passed, 3 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        1.035 s
Ran all test suites.
Done in 2.26s.
```

### 总结

现在是不是还不明白为什么要加`scheduler`这个参数，加上之后反而还让我们的数据不会及时更新了，会不会多此一举，其实这时候大家只要一步步看懂相关功能模块的实现，等到后面自然就会理解这其中的奥妙了。

下一节，我们继续完善`effect`的功能，为它添加`stop`功能。