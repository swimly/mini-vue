import {reactive} from '../reactive'
describe("reactive", () => {
  it("happy path", () => {
    const origin = {
      foo: 1
    }
    const obj = reactive(origin)
    expect(obj).not.toBe(origin)
    expect(obj.foo).toBe(1)
  })
})