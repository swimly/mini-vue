import {h, ref} from '../../dist/index.esm.js'
import {Foo} from './Foo.js'
window.self = null
const App = {
  name: 'app',
  setup () {
    const count = ref(0);
    const onClick = () => {
      count.value ++
      console.log(count.value)
    }
    return {
      count,
      onClick
    }
  },
  render () {
    return h(
      "div",
      {
        id: 'root'
      },
      [
        h('div', {}, `count:${this.count}`),
        h('button', {
          onClick: this.onClick
        }, 'click')
      ]
    )
  }
}

export default App