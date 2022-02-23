## onStop

上一节，我们完成了`stop`的相关逻辑，通过`stop(runner)`可以避免响应式数据改变的时候自动执行`runner`函数，现在又有一个新需求，我想在`stop`执行的时候做一些处理，这又该怎么实现呢？

### 单测

先一起来阅读下面的单测

``` javascript
// src/reactivity/test/effect.spec.ts
describe("effect", () => {
  ...
  it("onStop", () => {
    // 创建响应式对象obj
    const obj = reactive({
      foo: 1
    })
    const onStop = jest.fn() //定义了一个jest函数
    let dummy
    // 通过effect返回runner，并在第二个参数定义了一个onStop回调
    const runner = effect(() => {
      dummy = obj.foo
    }, {
      onStop
    })
    // 当执行stop之后，期望onStop回调被执行
    stop(runner)
    expect(onStop).toBelCalledTimes(1)
  })
})
```

通过上面单测的描述，其实这个功能很简单，就是在执行`stop`的时候，会调用`effect`传入`onStop`函数。

### 编码

从上面的测试用例来看，`onStop`的用法与`scheduler`非常类似，都是通过`effect`的第二个参数来传递的

#### 1、接收传递的`onStop`

首先，我们找到`effect`函数，从`options`中获取`onStop`参数，并将其赋值给实例化对象`_effect`。

``` javascript
// src/reactivity/effect.ts
export function effect (fn, options:any = {}) {
  ...
  _effect.onStop = options.onStop
  ...
}
```

?> 思考：这里我们接收`onStop`就可以了，为什么还要赋值给`_effect`实例化对象呢？因为我们上一节写的`stop`方法实际上调用的是`ReactiveEffect`类里面的方法，这样，我们把`onStop`也赋值给这个实例化对象，这样更方便在`stop`里面去调用。

#### 2、调用`onStop`方法

上一步我们已经将接收的`onStop`方法传递给了实例化对象`_effect`，接下来，我们需要在`ReactiveEffect`中定义一个`onStop`，并在`stop`的时候来调用

``` javascript
// src/reactivity/effect.ts

class ReactiveEffect {
  ...
  onStop?: () => void  //onStop是可选值
  ...
  stop () {
    if (this.active) {
      cleanupEffect(this)
      // 当接收到onStop，执行它便可
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}
```

到这里，就是全部的`onStop`逻辑了

#### 优化方案

下面，我们一起来看下我们这一节写的代码有没有哪里还有优化的余地，`_effect.onStop = options.onStop`，在`effect`中，我们通过这种简单赋值的方式将`effect`第二个参数传入的值一个个的赋值给`effect`，每次这样操作，有点繁琐，下面就一起来对这段代码进行优化。

?> 分析：其实我们需要做的就是将`options`的值挨个赋值给`effect`，

我们便可以这么操作，利用`Object.assign`。

``` javascript
// src/shared/index.ts
export const extend = Object.assign

```

``` javascript
import {extend} from '../shared'
export function effect (fn, options:any = {}) {
  ...
  extend(_effect, options)
  ...
}
```

上面，我们通过创建一个`shared`公共函数库，然后在`effect`中引用它，进行对象的赋值操作，这样不仅简化了这里的代码，还抽出了一个公共的函数，后续可以在其他地方调用。

### 解决bug

到这里，我们已经完成了`onStop`的所有功能，但当我们执行所有单测的时候`yarn test`，会发现`activeEffect.deps.push(dep)`报错`Cannot read property 'deps' of undefined`，那我们就来看下相关的代码！

### 总结

在编写`onStop`的时候，我们参考`scheduler`的方式，先在`effect`中进行赋值，然后在`ReactiveEffect`中定义一个`onStop`，并在`stop`中进行调用，不仅如此，我们还对代码进行了抽离公共方法，简化代码逻辑，更达到了代码的复用。

下一节，我们一起来了解readonly！