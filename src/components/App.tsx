import './App.scss'
import '@/css/global.scss'
import { h, Fragment } from 'preact'
import TitleBar from './titleBar/TitleBar'
import UpperPanel from './upperPanel/UpperPanel'
import Constructor from './constructor/Constructor'
import store from '@/store'
import Design from './design/Design'
import StartScreen from './start/StartScreen'

const App = () => {
  const getCurrentWindow = function () {
    if (!store.isLoaded) return <></>

    switch (store.currentTab.openedEditorWindow) {
      case 'constructor':
        return <Constructor />
      case 'design':
        return <Design />
      case 'start':
        return <StartScreen />
      default:
        return <></>
    }
  }

  const isUpperPanelShown = store.isLoaded && !store.currentTab.isStartScreen

  return (
    <div class="app">
      <TitleBar />
      {isUpperPanelShown ? <UpperPanel /> : null}
      {getCurrentWindow()}
    </div>
  )
}
export default App
