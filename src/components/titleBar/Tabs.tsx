import './Tabs.scss'

import { h, JSX } from 'preact'

import { useReactiveState } from '@/util/reactivity'
import assets from '@/assets'
import store from '@/store'

interface ITabsProps {
  names: string[]
  openedTabIndex?: number
  onReplaced?: (prevIndex: number, newIndex: number) => void
  onTabOpened?: (index: number) => void
  onAddClick?: () => void
}

const Tabs = (props: ITabsProps) => {
  const state = useReactiveState({
    draggingTabIndex: -1,
    draggingTabStartX: -1,
    draggingTabCurrentX: -1,
    startOffsetX: 0,
    tabSize: 200,
  })

  const getDraggingTabDelta = function () {
    return Math.round((state.draggingTabCurrentX - state.draggingTabStartX) / state.tabSize)
  }

  const onMousedown = function (tabIndex: number, event: MouseEvent) {
    const target: any = event.target
    if (event.shiftKey) {
      store.closeTab(tabIndex)
      return
    }

    if (target.clientWidth) state.tabSize = target.clientWidth + 1
    if (tabIndex != props.openedTabIndex) props?.onTabOpened(tabIndex)
    state.draggingTabIndex = tabIndex
    state.startOffsetX = 0

    let mouseUpListener = (event: MouseEvent) => {
      let delta = getDraggingTabDelta()
      if (props.onReplaced) {
        let newPosition = state.draggingTabIndex + delta
        newPosition = Math.max(0, Math.min(newPosition, props.names.length - 1))
        props.onReplaced(state.draggingTabIndex, newPosition)
      }
      if (state.draggingTabIndex == tabIndex) state.draggingTabIndex = -1
      state.draggingTabStartX = state.draggingTabCurrentX = -1
      window.removeEventListener('mouseup', mouseUpListener)
      window.removeEventListener('mousemove', mouseMoveListener)
    }

    let mouseMoveListener = (event: MouseEvent) => {
      let x = event.clientX

      if (x - state.startOffsetX < 30) x = state.startOffsetX + 30
      if (window.innerWidth - 135 - state.tabSize + state.startOffsetX < x)
        x = window.innerWidth - 135 + state.startOffsetX - state.tabSize

      state.draggingTabCurrentX = x
      if (state.draggingTabStartX == -1) {
        console.log('setting start x')
        state.draggingTabStartX = x
        state.startOffsetX = event.offsetX
      }
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
        <div class={tabClasses.join(' ')} key={i} style={tabStyles} onMouseDown={(event) => onMousedown(i, event)}>
          {props.names[i]}
        </div>
      )
    }
    return result
  }

  const addButtonStyle =
    state.draggingTabIndex != -1 ? { opacity: '0', transition: '0.3s' } : { opacity: '1', transition: '0.3s' }

  return (
    <div class="tabs">
      {renderTabs()}
      <div class="tabs__add-button" onClick={() => store.openStartPage()} style={addButtonStyle}>
        <img src={assets.addSmall} alt="" />
      </div>
    </div>
  )
}
export default Tabs
