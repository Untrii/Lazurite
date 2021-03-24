import './Design.scss'

import { h, Fragment } from 'preact'

import assets from '@/assets'
import store from '@/store'
import * as navigation from '@/store/actions/navigation'
import { DesignTab } from '@/models/store/TabStateModel'

import VerticalNav from '../controls/VerticalNav'
import ColorEditor from './colorEditor/ColorEditor'
import TextPresetsEditor from './textPresetsEditor/TextPresetsEditor'

const Design = () => {
  const tabs = [
    { displayName: 'Color', name: 'color' as DesignTab, icon: assets.color },
    { displayName: 'Typography', name: 'typography' as DesignTab, icon: assets.text },
  ]

  const getTab = function () {
    switch (store.currentTab.openededDesignTab) {
      case 'color':
        return <ColorEditor />
      case 'typography':
        return <TextPresetsEditor />
      default:
        return <></>
    }
  }

  const onTabChange = function (index: number) {
    navigation.changeDesignTab(tabs[index].name)
  }

  const currentTabIndex = tabs.findIndex((tab) => tab.name == store.currentTab.openededDesignTab)

  return (
    <div class="design-tab">
      <div class="design-tab__content">{getTab()}</div>
      <VerticalNav items={tabs} onChange={onTabChange} selectedItemIndex={currentTabIndex} />
    </div>
  )
}
export default Design
