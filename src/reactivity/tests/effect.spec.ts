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
  })
})