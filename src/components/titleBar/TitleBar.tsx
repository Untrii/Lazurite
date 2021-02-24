import './TitleBar.scss'
import { h } from 'preact'
import assets from '@/assets/index'
import Tabs from './Tabs'
import WindowControls from './WindowControls'
import { reactiveComponent, useReactiveState } from '@/util/reactivity'
import { remote } from 'electron'

const TitleBar = () => {
  const state = useReactiveState(() => {
    //ToDo: перенести в глобальное состояние
    remote.getCurrentWindow().on('maximize', () => {
      state.isMaximized = true
    })
    remote.getCurrentWindow().on('unmaximize', () => {
      state.isMaximized = false
    })

    return {
      isMaximized: remote.getCurrentWindow().isMaximized(),
      tabs: ['Sample tab', 'Sample tab 2', 'Sample tab 3', 'Sample tab 4'],
      openedIndex: 1,
    }
  })

  const onTabOpened = function (index: number) {
    console.log(state)
    state.openedIndex = index
  }

  const onReplaced = function (prevIndex: number, newIndex: number) {
    let currentIndexValue = state.tabs.splice(prevIndex, 1)
    state.tabs.splice(newIndex, 0, currentIndexValue[0])
    state.openedIndex = newIndex
  }

  const dragAreaClasses = ['title-bar__drag-area']
  if (state.isMaximized) dragAreaClasses.push('title-bar__drag-area_window-maximized')

  return (
    <div class="title-bar">
      <div class="title-bar__logo">
        <img src={assets.logo} alt="" />
      </div>
      <Tabs names={state.tabs} openedTabIndex={state.openedIndex} onTabOpened={onTabOpened} onReplaced={onReplaced} />
      <div class={dragAreaClasses.join(' ')}></div>
      <WindowControls />
    </div>
  )
}
export default TitleBar
