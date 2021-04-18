import './PresetCard.scss'

import { h } from 'preact'

import { requireResource, requireResourceAsync } from '@/dataLoader'
import { useReactiveState } from '@/util/reactivity'
import getFontFamilyName from '@/util/text/getFontFamilyName'
import getFontScale from '@/util/text/getFontScale'
import assets from '@/assets'

import Prepend from '@/components/controls/Prepend'
import NumberInput from '@/components/controls/NumberInput'
import Button from '@/components/controls/Button'

interface IPresetCardProps {
  selected?: boolean
  onSelect?: () => void
  onDelete?: () => void
  name: string
  onNameChange?: (name: string) => void
  fontName: string
  fontSource: string
  variants: string[]
  selectedVariant: string
  onVariantChange?: (variant: string) => void
  size: number
  onSizeChange?: (size: number) => void
  weights: number[]
  selectedWeight: number
  onWeightChange?: (weight: number) => void
}

const PresetCard = ({
  selected,
  onSelect,
  onDelete,
  name,
  onNameChange,
  fontName,
  fontSource,
  variants,
  selectedVariant,
  onVariantChange,
  size,
  onSizeChange,
  weights,
  selectedWeight,
  onWeightChange,
}: IPresetCardProps) => {
  const state = useReactiveState({
    loadedFont: {
      family: '',
      weight: 400,
      scale: 1,
    },
  })

  const renderUpper = function () {
    const isFontLoaded = requireResource(fontSource)
    const updateFont = function () {
      const family = getFontFamilyName(fontSource)
      const weight = selectedWeight
      const scale = getFontScale(family, weight)
      state.loadedFont = { family, weight, scale }
    }

    if (!isFontLoaded) requireResourceAsync(fontSource).then(() => updateFont())
    else updateFont()

    const inputStyle = {
      fontFamily: state.loadedFont.family,
      fontSize: size + 'px',
      fontWeight: state.loadedFont.weight,
      height: Math.ceil(size * state.loadedFont.scale) + 'px',
    }

    return (
      <div class="preset-card__upper">
        <input
          size={1}
          style={inputStyle}
          type="text"
          value={name}
          class="preset-card__name"
          onInput={(event) => onNameChange?.((event.target as any).value)}
        />
        {selected ? null : <span class="preset-card__inscription">Click to select...</span>}
        <Button
          icon={assets.delete}
          colorName={selected ? 'blue-300' : 'blue-600'}
          onClick={onDelete}
          className="preset-card__delete-button"
        />
      </div>
    )
  }

  return (
    <div
      class={'preset-card control-bg_blue-500' + (selected ? ' pressed-control-bg_blue-500' : '')}
      onClick={() => onSelect?.()}
      onFocus={() => onSelect?.()}
    >
      {renderUpper()}
      <div class="preset-card__input">
        <Prepend>Font:</Prepend>
        <span style="color:white; white-space:nowrap">{fontName}</span>
      </div>
      <div class="preset-card__input">
        <Prepend>Size:</Prepend>
        <NumberInput value={size} onChange={onSizeChange} step={1} minValue={5} maxValue={200} />
      </div>
      <div class="preset-card__input">
        <Prepend>Variant:</Prepend>
        <span style="color:white">{selectedVariant}</span>
      </div>
      <div class="preset-card__input">
        <Prepend>Weight:</Prepend>
        <span style="color:white">{selectedWeight}</span>
      </div>
    </div>
  )
}
export default PresetCard
