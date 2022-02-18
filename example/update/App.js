import {h, ref} from '../../dist/index.esm.js'
window.self = null
const App = {
  name: 'app',
  setup () {
    const count = ref(0);
    const onClick = () => {
      count.value ++
    }
    return {
      count,
      onClick
    }
  },
  render () {
    console.log(this.count)
    return h(
      "div",
      {
        id: 'root'
      },
      [
        h('div', {}, `count：` + this.count), //依赖收集
        h('button', {
          onClick: this.onClick
        }, 'click')
      ]
    )
  }
}

export default App