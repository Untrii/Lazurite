import { useReactiveState } from '@/util/reactivity'
import { h, JSX } from 'preact'
import { useState } from 'preact/hooks'
import './Tabs.scss'

interface TabsProps {
  names: string[]
  openedTabIndex?: number
  onReplaced?: (prevIndex: number, newIndex: number) => void
  onTabOpened?: (index: number) => void
  onAddClick?: () => void
}

const Tabs = (props: TabsProps) => {
  const state = useReactiveState({
    draggingTabIndex: -1,
    draggingTabStartX: -1,
    draggingTabCurrentX: -1,
    tabSize: 200,
  })

  // const state = {
  //   draggingTabIndex: -1,
  //   draggingTabStartX: -1,
  //   draggingTabCurrentX: -1,
  // }

  //let state.tabSize = 200

  const getDraggingTabDelta = function () {
    return Math.round((state.draggingTabCurrentX - state.draggingTabStartX) / state.tabSize)
  }

  const onMousedown = function (tabIndex: number, event: MouseEvent) {
    const target: any = event.target
    if (target.clientWidth) state.tabSize = target.clientWidth + 1
    if (tabIndex != props.openedTabIndex && props.onTabOpened) props.onTabOpened(tabIndex)
    state.draggingTabIndex = tabIndex
    let mouseUpListener = (event: MouseEvent) => {
      let delta = getDraggingTabDelta()
      if (props.onReplaced && typeof props.openedTabIndex == 'number')
        props.onReplaced(state.draggingTabIndex, state.draggingTabIndex + delta)
      if (state.draggingTabIndex == tabIndex) state.draggingTabIndex = -1
      state.draggingTabStartX = state.draggingTabCurrentX = -1
      window.removeEventListener('mouseup', mouseUpListener)
      window.removeEventListener('mousemove', mouseMoveListener)
    }
    let mouseMoveListener = (event: MouseEvent) => {
      state.draggingTabCurrentX = event.clientX
      if (state.draggingTabStartX == -1) state.draggingTabStartX = event.clientX
    }
    window.addEventListener('mouseup', mouseUpListener)
    window.addEventListener('mousemove', mouseMoveListener)
  }

  const renderTabs = function () {
    let result = [] as JSX.Element[]
    for (let i = 0; i < props.names.length; i++) {
      let tabClasses = ['tab']
      let tabStyles: any = {}

      let tabPosition = i

      if (state.draggingTabIndex == i) tabClasses.push('tab_dragging')
      if (state.draggingTabIndex != -1) {
        let offset = 0
        let dragDelta = state.draggingTabCurrentX - state.draggingTabStartX
        if (i == state.draggingTabIndex) offset = dragDelta
        else {
          if (i > state.draggingTabIndex && dragDelta / state.tabSize + 0.5 + state.draggingTabIndex > i) {
            offset -= state.tabSize
            tabPosition--
          }
          if (i < state.draggingTabIndex && dragDelta / state.tabSize - 0.5 + state.draggingTabIndex < i) {
            offset += state.tabSize
            tabPosition++
          }
        }
        tabStyles = {
          transform: `translateX(${offset}px)`,
        }
        if (i != props.openedTabIndex && state.draggingTabStartX != state.draggingTabCurrentX) {
          tabStyles.transition = '0.3s'
        }
      }

      let currentDraggingTabPosition = (props.openedTabIndex ?? 0) + getDraggingTabDelta()
      if (i == props.openedTabIndex) tabClasses.push('tab_selected')
      else if (tabPosition + 1 != currentDraggingTabPosition && tabPosition + 1 != props.names.length)
        tabClasses.push('tab_border-right')

      result.push(
        <div class={tabClasses.join(' ')} style={tabStyles} onMouseDown={(event) => onMousedown(i, event)}>
          {props.names[i]}
        </div>
      )
    }
    return result
  }
  console.log('rerendering')
  return <div class="tabs">{renderTabs()}</div>
}
export default Tabs
