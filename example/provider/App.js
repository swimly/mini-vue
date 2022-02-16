import {h, provide, inject} from '../../dist/index.esm.js'
const Provider = {
  name: 'Provider',
  setup() {
    provide("foo", "fooval")
    provide("bar", "barval")
  },
  render () {
    return h("div", {}, [h("p", {}, "provider"), h(ProviderTwo)])
  }
}

const ProviderTwo = {
  name: 'ProviderTwo',
  setup() {
    provide("foo", "fooTwo")
    const foo = inject("foo")
    return {
      foo
    }
  },
  render () {
    return h("div", {}, [h("p", {}, `ProviderTwo foo: ${this.foo}`), h(Consumer)])
  }
}

const Consumer = {
  name: "consumer",
  setup () {
    const foo = inject("foo")
    const bar = inject("bar")
    const baz = inject('baz', () => 'bazdefault')
    return {
      foo, bar, baz
    }
  },
  render () {
    return h("div", {}, `Consumer: - ${this.foo} - ${this.bar} - ${this.baz}`)
  }
}

export default {
  name: "App",
  setup () {},
  render () {
    return h("div", {}, [h("p", {}, "apiInject"), h(Provider)])
  }
}