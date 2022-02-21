### 返回runner

我们一起了解一下这个`runner`到底是什么东西，有啥用。不然要他有何用。

?> 功能描述：当我们调用`effect(fn)`之后，返回的应该是一个`function`函数，这个函数便是我们所说的`runner`，当我们调用这个`runner`的时候，会再次去执行我们传入`effect`的函数(`fn`)，并且我们还能获取`fn`返回的数据。

``` javascript
const fn = () => {
  //函数体
}
const runner = effect(fn)
runner()  //这时候实际执行的是上面定义的fn
```

第一步，我们来处理调用`effect(fn)`之后，我们要将传入进来的`fn`返回出去。

**编辑`src/reactivity/effect.ts`**

通过返回`_effect.run`即可，这样在外面再次调用`effect`返回的函数，便相当于再次调用了`effect`内部的`run`，由于在`ReactiveEffect`的`run`方法中调用了`activeEffect = this`，所以在这里我们将返回的`runner`函数的`this`绑定为当前创建的`ReactiveEffect`实例，即`bind(_effect)`。

``` javascript
export function effect (fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
  // 添加如下代码
  return _effect.run.bind(_effect)
}
```

接下来，我们再去处理`ReactiveEffect`中`run`的返回值，直接返回`fn`的执行结果即可。

``` javascript
public run () {
  activeEffect = this
  // 修改下面的代码
  const res = this._fn()
  return res
}
```

直接将传入进来的`fn`的执行结果赋值给`res`，最后`return`出去即可。

最后，我们创建一个测试文件

``` javascript
import {reactive, effect} from '../../dist/index.esm.js'
let foo = 10
const runner = effect(() => {
  foo ++
  return 'runner'
})
console.log(foo) // 11
const r = runner()
console.log(r, foo) //runner 12
```

第一次执行`effect`的时候，会将创建的`effect`实例对象中的`run`函数赋值给`runner`，并执行一次传入的`fn`，所以这时候`foo`会变成11，当执行`const r = runner()`的时候会再次调用`effect`传入的`fn`，并将返回值赋值给`r`，这时候`foo`会再次加1，并把返回值`runner`赋值给`r`。