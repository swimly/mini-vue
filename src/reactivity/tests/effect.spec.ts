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
})