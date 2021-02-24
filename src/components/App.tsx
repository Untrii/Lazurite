import './App.scss'
import { h } from 'preact'
import TitleBar from './titleBar/TitleBar'
import UpperPanel from './upperPanel/UpperPanel'
import Constructor from './constructor/Constructor'

const App = () => {
  return (
    <div class="app">
      <TitleBar />
      <UpperPanel />
      <Constructor />
    </div>
  )
}
export default App
