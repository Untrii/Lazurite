import './TitleBar.scss'
import { h } from 'preact'
import assets from '@/assets/index'
import Tabs from './Tabs'
import WindowControls from './WindowControls'
import { reactiveComponent, useReactiveState } from '@/util/reactivity'
import { useState } from 'preact/hooks'

const TitleBar = () => {
  const state = useReactiveState({
    tabs: ['Sample tab', 'Sample tab 2', 'Sample tab 3', 'Sample tab 4'],
    openedIndex: 1,
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

  return (
    <div class="title-bar">
      <div class="title-bar__logo">
        <img src={assets.logo} alt="" />
      </div>
      <Tabs names={state.tabs} openedTabIndex={state.openedIndex} onTabOpened={onTabOpened} onReplaced={onReplaced} />
      <div class="title-bar__drag-area"></div>
      <WindowControls />
    </div>
  )
  //return <div className="hello-world">Hello world!</div>
}
export default TitleBar
