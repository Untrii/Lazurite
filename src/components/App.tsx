import './App.scss'
import { h } from 'preact'
import TitleBar from './titleBar/TitleBar'
import UpperPanel from './upperPanel/UpperPanel'

const App = () => {
  return (
    <div class="app">
      <TitleBar />
      <UpperPanel />
    </div>
  )
}
export default App
