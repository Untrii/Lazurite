import './AddTab.scss'

import { h, JSX } from 'preact'

import assets from '@/assets'
import store from '@/store'
import { AnyTool, PointerTool } from '@/models/editor/Tool'
import Button from '@/components/controls/Button'

interface IToolButton {
  displayName: string
  icon: string
  iconScale: number
  tool: AnyTool
}

interface IButtonGroup {
  name: string
  displayName: string | null
  items: IToolButton[]
}

function getButtonGroups(): IButtonGroup[] {
  const fontPresets = store.currentTab.openedPresentation.theme.fontPresets

  const result: IButtonGroup[] = []
  result.push({
    name: 'pointer',
    displayName: null,
    items: [
      {
        displayName: 'Pointer',
        icon: assets.pointer,
        iconScale: 1,
        tool: new PointerTool(),
      },
    ],
  })

  const text: IToolButton[] = []

  let minFontSize = 200
  let maxFontSize = 5

  for (const preset of fontPresets) {
    maxFontSize = Math.max(maxFontSize, preset.size)
    minFontSize = Math.min(minFontSize, preset.size)
  }

  for (const preset of fontPresets) {
    const iconScale = (preset.size / maxFontSize) * 1.6

    const previewURL = preset.fontSource.replace('local://', 'font-preview://') + '::Aa'
    text.push({
      displayName: preset.name,
      icon: previewURL,
      iconScale,
      tool: new PointerTool(),
    })
  }
  result.push({
    name: 'text',
    displayName: 'Text',
    items: text,
  })

  return result
}

const AddTab = () => {
  const buttonGroups: IButtonGroup[] = getButtonGroups()
  const [selectedGroupIndex, selectedItemIndex] = store.currentTab.addTabToolIndex

  return (
    <div class="add-tab">
      {buttonGroups.map((group, groupIndex) => (
        <div class="add-tab__group">
          {group.displayName ? <h3 class="add-tab__group-title">{group.displayName}</h3> : null}
          {group.items.map((item, itemIndex) => (
            <div class="add-tab__group-button">
              <Button
                text={item.displayName}
                icon={item.icon}
                iconScale={item.iconScale}
                size="large"
                blockLevel
                pressed={selectedGroupIndex == groupIndex && selectedItemIndex == itemIndex}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
export default AddTab
