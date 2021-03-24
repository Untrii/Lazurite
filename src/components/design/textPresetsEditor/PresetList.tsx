import './PresetList.scss'
import Button from '@/components/controls/Button'
import { h } from 'preact'
import PresetCard from './PresetCard'
import store from '@/store'
import Font from '@/models/common/Font'
import * as design from '@/store/actions/design'
import getFontFamilyName from '@/util/getFontFamilyName'
import { requireResource } from '@/dataLoader'

interface IPresetListProps {
  onPresetSelect?: (index: number) => void
  selectedIndex: number
  fonts: Font[]
}

const PresetList = ({ onPresetSelect, selectedIndex, fonts }: IPresetListProps) => {
  const presets = store.currentTab.openedPresentation.theme.fontPresets

  const renderUpper = function () {
    const onAddClick = function () {
      design.addFontPreset()
    }

    return (
      <div class="preset-list__upper">
        <div class="preset-list__title">Presets</div>
        <div class="preset-list__buttons">
          <Button text="Add new" className="preset-list__button" colorName="blue-500" onClick={onAddClick} />
          <Button text="Random" className="preset-list__button" colorName="blue-500" />
        </div>
      </div>
    )
  }

  const renderPresets = function () {
    const getFontByName = function (name: string) {
      for (const font of fonts) {
        if (font.name == name) return font
      }
      return new Font()
    }

    const onNameChange = function (index: number, newName: string) {
      design.changePresetName(index, newName)
    }

    const onSizeChange = function (index: number, newSize: number) {
      design.changePresetFontSize(index, newSize)
    }

    return presets.map((preset, index) => {
      const font = getFontByName(preset.fontName)
      requireResource(preset.fontSource)

      return (
        <PresetCard
          key={index}
          onSelect={() => onPresetSelect?.(index)}
          selected={index == selectedIndex}
          onNameChange={(name) => onNameChange(index, name)}
          name={preset.name}
          fontName={preset.fontName}
          fontSource={preset.fontSource}
          variants={font.types}
          selectedVariant={preset.fontType}
          size={preset.size}
          onSizeChange={(size) => onSizeChange(index, size)}
          weights={font.weights}
          selectedWeight={preset.weight}
        />
      )
    })
  }

  return (
    <div class="preset-list">
      {renderUpper()}
      {renderPresets()}
    </div>
  )
}
export default PresetList
