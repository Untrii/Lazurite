import './InstrumentsPanel.scss'

import { h } from 'preact'
import { useState } from 'preact/hooks'

import assets from '@/assets'

import VerticalNav, { INavItem } from '@/components/controls/VerticalNav'
import Button from '@/components/controls/Button'
import AddTab from './AddTab'

const InstrumentsPanel = () => {
  const tabs: INavItem[] = [
    {
      icon: assets.add,
      displayName: 'Add',
    },
    {
      icon: assets.edit,
      displayName: 'Edit',
    },
    {
      icon: assets.history,
      displayName: 'History',
    },
  ]

  const [tabIndex, setTabIndex] = useState(0)

  const onChange = function (index: number) {
    setTabIndex(index)
  }

  const getTab = function () {
    switch (tabIndex) {
      case 0:
        return <AddTab />
      default:
        return null
    }
  }

  return (
    <div class="instruments-panel">
      <div class="instruments-panel__content">{getTab()}</div>
      <VerticalNav items={tabs} selectedItemIndex={tabIndex} onChange={onChange} />
    </div>
  )
}
export default InstrumentsPanel
