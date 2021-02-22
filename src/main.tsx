import 'preact/debug'
import { render, h } from 'preact'

const App = () => {
  return <div>Hello world!</div>
}

render(<App />, document.querySelector('#app'))
console.log('abcd')
