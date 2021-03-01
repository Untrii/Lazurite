import './InstrumentsPanel.scss'
import { h } from 'preact'
import VerticalNav, { INavItem } from '@/components/controls/VerticalNav'
import assets from '@/assets'
import { useState } from 'preact/hooks'
import NumberInput from '@/components/controls/NumberInput'

const InstrumentsPanel = () => {
  const tabs: INavItem[] = [
    {
      icon: assets.add,
      name: 'add',
      displayName: 'Add',
    },
    {
      icon: assets.edit,
      name: 'edit',
      displayName: 'Edit',
    },
    {
      icon: assets.history,
      name: 'history',
      displayName: 'History',
    },
  ]

  const [tabIndex, setTabIndex] = useState(0)

  const onChange = function (index: number) {
    setTabIndex(index)
  }

  return (
    <div class="instruments-panel">
      <div class="instruments-panel__content">
        <NumberInput prepend="Number input" />
      </div>
      <VerticalNav items={tabs} selectedItemIndex={tabIndex} onChange={onChange} />
    </div>
  )
}
export default InstrumentsPanel
