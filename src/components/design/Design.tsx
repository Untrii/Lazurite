import './Design.scss'
import { h, Fragment } from 'preact'
import VerticalNav from '../controls/VerticalNav'
import assets from '@/assets'
import { useState } from 'preact/hooks'
import ColorEditor from './ColorEditor'

const Design = () => {
  const tabs = [
    { displayName: 'Color', icon: assets.color },
    { displayName: 'Typography', icon: assets.text },
  ]

  const [currentTabIndex, changeTabIndex] = useState(0)

  const getTab = function (index: number) {
    switch (index) {
      case 0:
        return <ColorEditor />
      default:
        return <></>
    }
  }

  return (
    <div class="design-tab">
      <div class="design-tab__content">{getTab(currentTabIndex)}</div>
      <VerticalNav items={tabs} onChange={changeTabIndex} selectedItemIndex={currentTabIndex} />
    </div>
  )
}
export default Design
