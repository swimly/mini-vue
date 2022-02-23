import {effect} from "../effect"
import {reactive} from "../reactive"
describe("effect", () => {
  it("happy path", () => {
    // 创建一个响应式对象
    const user = reactive({
      age: 10
    })
    // 定义全局变量nextAge
    let nextAge;
    // 执行effect，接收一个fn作为参数，在函数内部对nextAge进行赋值
    effect(() => {
      nextAge = user.age + 1
    })
    // 赋值成功，说明在执行effect的时候会自动执行传入的函数
    expect(nextAge).toBe(11)
    user.age ++
    expect(nextAge).toBe(12)
  })
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