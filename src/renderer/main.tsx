import 'preact/debug'
import { render, h } from 'preact'
import App from './components/App'
import * as dataLoader from './dataLoader'

window['dataLoader'] = dataLoader

render(<App />, document.querySelector('#app'))
