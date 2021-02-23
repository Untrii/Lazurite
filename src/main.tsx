import 'preact/debug'
import './index.scss'
import { render, h } from 'preact'

const App = () => {
  return (
    <div class="abcd">
      <h1>Hello world!</h1>
    </div>
  )
}

render(<App />, document.querySelector('#app'))
console.log('abcd')
