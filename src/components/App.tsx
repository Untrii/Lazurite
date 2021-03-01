import './App.scss'
import { h, Fragment } from 'preact'
import TitleBar from './titleBar/TitleBar'
import UpperPanel from './upperPanel/UpperPanel'
import Constructor from './constructor/Constructor'
import store from '@/store'
import Design from './design/Design'

const App = () => {
  const getCurrentWindow = function () {
    switch (store.currentTab.openedEditorWindow) {
      case 'constructor':
        return <Constructor />
      case 'design':
        return <Design />
      default:
        return <></>
    }
  }

  return (
    <div class="app">
      <TitleBar />
      <UpperPanel />
      {getCurrentWindow()}
    </div>
  )
}
export default App
