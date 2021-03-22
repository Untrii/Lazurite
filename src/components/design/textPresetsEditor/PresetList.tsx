import './PresetList.scss'
import Button from '@/components/controls/Button'
import { h } from 'preact'
import PresetCard from './PresetCard'
import store from '@/store'
import Font from '@/models/common/Font'
import * as design from '@/store/actions/design'

interface IPresetListProps {
  onPresetSelect?: (index: number) => void
  fonts: Font[]
}

const PresetList = ({ onPresetSelect, fonts }: IPresetListProps) => {
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

    return presets.map((preset, index) => {
      const font = getFontByName(preset.fontName)

      return (
        <PresetCard
          onSelect={() => onPresetSelect(index)}
          onNameChange={(name) => onNameChange(index, name)}
          name={preset.name}
          fontName={preset.fontName}
          variants={font.types}
          selectedVariant={preset.fontType}
          size={48}
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
