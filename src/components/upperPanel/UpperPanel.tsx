import './UpperPanel.scss'
import { h } from 'preact'
import LzButton from '../controls/LzButton'
import assets from '@/assets/index'
import HorizontalNav from '../controls/HorizontalNav'
import store from '@/store'
import * as navigation from '@/store/actions/navigation'
import { EditorWindowName } from '@/models/store/TabStateModel'

const UpperPanel = () => {
  const navItems = [
    { displayName: 'Constructor', name: 'constructor' as EditorWindowName },
    { displayName: 'Design', name: 'design' as EditorWindowName },
  ]
  const selectedItemIndex = navItems.findIndex((value) => {
    return value.name == store.currentTab.openedEditorWindow
  })

  const onChange = function (index: number) {
    navigation.openWindow(navItems[index].name)
  }

  return (
    <div class="upper-panel">
      <HorizontalNav
        className="upper-panel__workspace-selector"
        items={navItems}
        selectedItemIndex={selectedItemIndex}
        onChange={onChange}
      />
      <div class="upper-panel__buttons">
        <LzButton
          className="upper-panel__button"
          icon={assets.play}
          text="Launch from this slide"
          colorName="blue-500"
        />
        <LzButton className="upper-panel__button" icon={assets.menu} colorName="blue-500" />
      </div>
    </div>
  )
}
export default UpperPanel
