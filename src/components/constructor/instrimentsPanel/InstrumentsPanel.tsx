import './InstrumentsPanel.scss'
import { h } from 'preact'
import VerticalNav, { INavItem } from '@/components/controls/VerticalNav'
import assets from '@/assets'
import { useState } from 'preact/hooks'
import NumberInput from '@/components/controls/NumberInput'
import DropdownButton from '@/components/controls/DropdownButton'
import CompactRadio from '@/components/controls/CompactRadio'
import ColorPicker from '@/components/dialogs/ColorPicker'
import SearchBox from '@/components/controls/SearchBox'

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

  return (
    <div class="instruments-panel">
      <div class="instruments-panel__content">
        <NumberInput prepend="Number input" />

        <CompactRadio
          prepend="Abracadabra: "
          colorName="blue-500"
          variants={[
            { displayName: '1', icon: assets.add },
            { displayName: '2', icon: assets.add },
          ]}
        />

        <ColorPicker />
        <SearchBox />
      </div>
      <VerticalNav items={tabs} selectedItemIndex={tabIndex} onChange={onChange} />
    </div>
  )
}
export default InstrumentsPanel
