import { readonly } from "../reactive"

describe("readonly", () => {
  it("happy path", () => {
    const original = {foo: 1, bar: {baz: 2}}
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
  })
  it("warn when call set", () => {
    const user = readonly({
      age: 10
    })
    console.warn = jest.fn()
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})