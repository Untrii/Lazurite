import './TitleBar.scss'

import { h } from 'preact'
import { remote } from 'electron'

import assets from '@/assets/index'
import { useReactiveState } from 'common/util/reactivity'
import store from '@/store'

import Tabs from './Tabs'
import WindowControls from './WindowControls'

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
      openedIndex: 0,
    }
  })

  const getTabNames = function () {
    return store.tabs.map((tab) => tab.name)
  }

  const onTabOpened = function (index: number) {
    store.openTab(index)
  }

  const onReplaced = function (prevIndex: number, newIndex: number) {
    store.replaceTab(prevIndex, newIndex)
  }

  const dragAreaClasses = ['title-bar__drag-area']
  if (state.isMaximized) dragAreaClasses.push('title-bar__drag-area_window-maximized')

  return (
    <div class="title-bar">
      <div class="title-bar__logo">
        <img src={assets.logo} alt="" />
      </div>
      <Tabs
        names={getTabNames()}
        openedTabIndex={store.selectedTabIndex}
        onTabOpened={onTabOpened}
        onReplaced={onReplaced}
      />
      <div class={dragAreaClasses.join(' ')}></div>
      <WindowControls />
    </div>
  )
}
export default TitleBar
