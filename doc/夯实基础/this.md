### 概述

关于`this`指向问题，一直都是众说纷纭，"江湖"中一直流传一句很经典的话来描述this指向问题。(谁调用它，this就指向谁)，也就是说，`this`的指向是在调用时确定的，这么说虽然没什么问题，可是并不全面。

### 规律

`this`指向可谓千变万化，可究竟万变不离其宗，只需牢记如下规律：

?> 1、在函数体中，非显示或隐式调用函数时，在严格模式下，this指向`undefined`，在非严格模式则指向全局对象(`window`/`global`)

?> 2、一般使用`new`方法调用构造函数时，构造函数内的this会被绑定到新创建的对象上

?> 3、一般通过`call`、`apply`、`bind`方法显式调用函数时，函数体内的this会被绑定到指定参数的对象上

?> 4、一般通过上下文对象调用函数时，函数体内的this会被绑定到该对象上

?> 5、在箭头函数中，this的指向由外层（函数或全局）作用域来决定

### 实例分析

虽说规律如此，可实际情况却多式多样。

#### 全局环境中的this

下面这种情况，函数在全局环境中被调用，在非严格模式下，`this`指向`window`，在严格模式下指向`undefined`

``` javascript
function f1 () {
  console.log(this)
}
function f2 () {
  'use strict'
  console.log(this)
}
f1() //window
f2() //undefined
```

上面的例子很简单，接下来稍微改变一下。

``` javascript
const foo = {
  bar: 10,
  fn: function () {
    console.log(this)
    console.log(this.bar)
  }
}
var fn1 = foo.fn
fn1() // window undefined
```

上面的例子依然输出：`window`和`undefined`，虽然`fn`函数是在`foo`中定义的，却将其赋值给了`fn1`，而fn1仍是在全局环境中执行的，所以其函数体内的this自然指向`window`，`this.bar`等同于`window.bar`，自然就是`undefined`。

如果我们将上面的函数调用稍作修改

``` javascript
foo.fn() // {bar: 10, fn: f} 10
```

这时候，`this`指向的是最后调用它的对象`foo`。

> 结论：在执行函数时不考虑显式绑定，如果函数中的this是被上一级的对象调用，那么this指向的就是上一级对象，否则指向全局

#### 上下文对象调用中的this

`student.fn()`调用的时候其内部`this`指向便是`student`，其返回的`this`便是`student`，自然二者相等。

``` javascript
const student = {
  name: 'Lucas',
  fn: function () {
    return this
  }
}
console.log(student.fn() === student)
```

下面我们看一个更复杂的调用关系

``` javascript
const person = {
  name: 'Lucas',
  brother: {
    name: 'Mike',
    fn: function () {
      return this.name
    }
  }
}
console.log(person.brother.fn())
```
`this`会指定最后调用它的对象`person.brother`，`this.name`必然就是`Mike`。

接下来看一个更高阶的例子

``` javascript
const o1 = {
  text: 'o1',
  fn: function () {
    return this.text
  }
}
const o2 = {
  text: 'o2',
  fn: function () {
    return o1.fn()
  }
}
const o3 = {
  text: 'o3',
  fn: function () {
    var fn = o1.fn
    return fn()
  }
}
console.log(o1.fn()) //o1
console.log(o2.fn()) //o1
console.log(o3.fn()) //undefined
```

第一个通过`o1.fn`调用，其`this`指向必然时`o1`本身，其结果便是`o1.text`。

第二个调用的仍然是`o1.fn`，因此结果仍然是`o1`。

第三个在函数体内进行了赋值，并且通过简单调用，所以其`this`指向`window`，而`window`上并没有`text`属性，所以返回`undefined`。

如果现在要求调用`o2.fn()`时输出`o2`呢？

``` javascript
const o2 = {
  text: 'o2',
  fn: o1.fn
}
```

在上面的代码中，提前将`o1.fn`赋值给`o2.fn`，最后通过`o2.fn`来调用，`this`指向必然是`o2`。

#### 通过bind、call、apply改变this指向

`bind`，`call`，`apply`都可以用来改变函数的`this`指向，`call`和`apply`是直接进行相关函数调用，`bind`不会执行相关函数，而是返回一个新的函数并自动绑定了新的`this`指向

``` javascript
const target = {}
fn.call(target, 'arg1', 'arg2')
fn.apply(target, ['arg1', 'arg2'])
fn.bind(target, 'arg1', 'arg2')()
```

上面三种用法效果相同，都是将`fn`的指向改成`target`，并传入两个参数，然后执行该函数。

``` javascript
const foo = {
  name: 'Lucas',
  logName: function () {
    console.log(this.name)
  }
}
const bar = {
  name: 'mike'
}
console.log(foo.logName.call(bar)) // mike
```

上面便是修改函数`this`指向最基础的用法，也可以通过`apply`和`bind`改写。

#### 构造函数和this

首先我们来看一个例子

``` javascript
function Foo () {
  this.bar = 'Lucas'
}
const instance = new Foo()
console.log(instance.bar) // Lucas
```
很明显上面会打印出`Lucas`，可这中间到底发生了什么？

1、创建一个新的对象

2、将构造函数的`this`指向这个新的对象

3、为这个对象添加属性、方法等

4、返回新的对象

如果在构造函数中出现了显示的`return`情况，如下例：

``` javascript
function Foo () {
  this.user = 'Lucas'
  const o = {}
  return o
}
const ins = new Foo()
console.log(ins.user) // undefined
```

``` javascript
function Foo () {
  this.user = 'Lucas'
  return 1
}
const ins = new Foo()
console.log(ins.user) // Lucas
```

结论：如果构造函数中显示返回一个值，且返回的是一个对象，那么`this`就指向这个返回的对象，如果返回的是基本类型，那么`this`仍然指向实例。

#### 箭头函数中的this

箭头函数中的`this`指向是由其所属函数或全局作用域决定的

``` javascript
const foo = {
  fn: function () {
    setTimeout(function () {
      console.log(this)
    })
  }
}
console.log(foo.fn()) //window
```

上述例子，`this`出现在`setTimeout`匿名函数中，所以指向`window`。

如果想让`this`指向`foo`，则可巧妙的利用箭头函数来解决

``` javascript
const foo = {
  fn: function () {
    setTimeout(() => {
      console.log(this)
    })
  }
}
console.log(foo.fn()) //foo
```

#### this 优先级

单纯的箭头函数`this`指向很简单，但是综合所有情况，并结合`this`的优先级，那么这时指向就不那么简单确定。

我们通常把通过`call`，`apply`，`bind`，`new`对`this`进行绑定的情况称为显式绑定，根据调用确定`this`指向的情况称为隐式绑定。

究竟`显示绑定`和`隐式绑定`谁的优先级更高呢？

