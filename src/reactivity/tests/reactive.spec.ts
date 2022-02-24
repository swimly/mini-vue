import {reactive, isReactive} from '../reactive'
describe("reactive", () => {
  it("happy path", () => {
    const origin = {
      foo: 1
    }
    const obj = reactive(origin)
    expect(obj).not.toBe(origin)
    expect(obj.foo).toBe(1)

    expect(isReactive(obj)).toBe(true)
    expect(isReactive(origin)).toBe(false)
  })
})