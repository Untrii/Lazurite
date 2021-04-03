import './PresetList.scss'

import { h } from 'preact'

import { requireResource } from '@/dataLoader'
import store from '@/store'
import * as design from '@/store/actions/design'
import Font from '@/models/common/Font'

import Button from '@/components/controls/Button'
import PresetCard from './PresetCard'

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

    const onDelete = function (index: number) {
      design.deleteFontPreset(index)
    }

    return presets.map((preset, index) => {
      const font = getFontByName(preset.fontName)
      requireResource(preset.fontSource)

      return (
        <PresetCard
          key={index}
          onSelect={() => onPresetSelect?.(index)}
          onDelete={() => onDelete(index)}
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
      {presets.length == 0 ? (
        <div class="preset-list__placeholder">There is no font presets. You can add one using button above</div>
      ) : null}
      <div class="preset-list__items">{renderPresets()}</div>
    </div>
  )
}
export default PresetList
