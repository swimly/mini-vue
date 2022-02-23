## Stop

这个功能应该不用多说什么，看字面意思也能猜个八九不离十了，但作为程序员的我们，思想还是要严谨，老规矩，我们还是一起来看一个单测。

### 单测

下面，大家跟着单测的代码，逐行的看，其中会有以我自己的理解添加的注释，希望对大家阅读单测有所帮助。

``` javascript
// src/reactivity/effect.spec.ts
describe("effect", () => {
  ...
  it("stop", () => {
    let dummy;
    // 创建响应式对象obj
    const obj = reactive({prop: 1})
    // 这就是之前的runner，当再次执行相当于再次执行了fn
    const runner = effect(() => {
      dummy = obj.prop
    })
    // 更改响应式对象obj的prop值
    obj.prop = 2
    // 这时候dummy也会跟着变，到这一步都是常规操作
    expect(dummy).toBe(2)
    // 这里就是我们今天要实现的，也是一个function，有一个参数，就是我们的runner
    stop(runner)
    // 我们再次更新响应式对象的值
    obj.prop = 3
    // 发现dummy这次没变了，这就是我们今天要实现的主要功能点
    expect(dummy).toBe(2)
    // 再次执行runner，不出意外，dummy再次更新了
    runner()
    expect(dummy).toBe(3)
  })
})
```

通过阅读上面的单测，我们可以得出一下结论

- stop是一个function，`runner`是它唯一的参数。
- 执行`stop(runner)`之后，当响应式对象发生改变，并不会再次执行`effect(fn)`中的`fn`函数。
- 再次执行`runner()`，`dummy`会再次更新。

### 分析

通过上面的分析，我们都知道`stop`之后，会停止更新，也就是停止触发依赖，然而之前我们的程序会在触发`set`操作之后自动触发依赖，怎样才能让他停止触发呢？如果我们把当前`effect`从`targetMap`中删除呢，当触发依赖的时候找不到相关联的`effect`，自然就不会触发了。

### 编码

带着上面得出的结论和我们自己的分析，我们一步步来实现`stop`的相关代码逻辑。

#### 1、`stop`函数

既然`stop`是一个函数，首先，我们先在`effect.ts`中导出一个`function`。

``` javascript
// src/reactivity/effect.ts

export function stop (runner) {
  runner.effect.stop()
}
```

上面的代码，我们调用了`runner.effect`，可之前我们返回的`runner`上并没有`effect`。

#### 2、`runner`绑定`effect`实例

下面，我们对`effect`做一下修改，给返回的`runner`上添加`effect`。

``` javascript
export function effect (fn) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()
  // 将当前`effect`实例挂载到runner上面
  const runner:any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}
```

这样，`stop()`函数实际执行的便是`ReactiveEffect`类中的`stop`方法了。

#### 3、给`ReactiveEffect`类添加一个`stop`方法

通过上面一系列操作，我们根据`runner`已经关联到对应的`effect`。

?> 思考：有了effect，我们要怎么去清空收集当前`effect`的容器（`deps`）呢？在依赖收集的时候，我们将`effect`收集到对应的`deps`，这时候，我们顺便将`deps`存储到`effect`上是不是就可以了。

``` javascript
// src/reactivity/effect.ts
...
export function track (target, key) {
  ...
  activeEffect.deps.push(dep) //将dep存储在当前创建的effect中
}
...
class ReactiveEffect {
  ...
  deps = [] //定义一个deps用来存储收集当前`effect`的deps
  ...
  public stop () {
    //在这里我们需要清空当前的effect
    cleanUpEffect(this)
  }
}
function cleanUpEffect (effect) {
  effect.deps.forEach(dep:any => {
    dep.delete(effect)
  })
}
...
```

到这里，我们就完成了`stop`的基础功能，可是大家思考一个问题，当我们多次调用`stop`，每次都会去清空一次我们的`deps`，这样肯定多多少少有点影响性能，下面我们就对`stop`进行一个简单的优化，添加一个`active`状态，让他只清空一次。

``` javascript
// src/reactivity/effect.ts
class ReactiveEffect{
  ...
  active = true  //定义一个状态，判断是否已经清空过，默认为true，代表还没有清空
  ...
}
public stop () {
  // 如果还没有清空，我们就执行清空操作
  if (this.active) {
    cleanUpEffect(this)
    // 将状态改成已经清空，下次再执行stop的时候便不会再次执行该操作了
    this.active = false
  }
}
```

到这里，`stop`的功能就全部完成了。

### 总结

在这一节，我们对之前的`track`和`effect`稍微做了修改，在`effect`返回`runner`的时候，我们顺便将`effect`绑定在它上面，并且在收集依赖的时候，除了将`effect`存储到对应的`deps`容器上，顺便将`deps`挂载在`effect`上，当我们执行`stop(runner)`的时候，就可以先通过`runner`获取到其自身的`effect`，然后获取`effect`上挂载的`deps`，最后我们把这个`deps`中的`effect`删除即可。


下一节，我们来添加`onStop`。