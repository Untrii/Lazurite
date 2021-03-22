import './PresetCard.scss'
import { h } from 'preact'
import Prepend from '@/components/controls/Prepend'
import NumberInput from '@/components/controls/NumberInput'

interface IPresetCardProps {
  selected?: boolean
  onSelect?: () => void
  name: string
  onNameChange?: (name: string) => void
  fontName: string
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
  name,
  onNameChange,
  fontName,
  variants,
  selectedVariant,
  onVariantChange,
  size,
  onSizeChange,
  weights,
  selectedWeight,
  onWeightChange,
}: IPresetCardProps) => {
  return (
    <div class={'preset-card control-bg_blue-500' + (selected ? ' pressed-control-bg_blue-500' : '')}>
      <div class="preset-card__upper">
        <input
          type="text"
          value={name}
          class="preset-card__name"
          onInput={(event) => onNameChange?.((event.target as any).value)}
        />
        <span class="preset-card__inscription" onClick={() => onSelect?.()}>
          Click to select...
        </span>
      </div>
      <div class="preset-card__input">
        <Prepend>Font:</Prepend>
        <span style="color:white">{fontName}</span>
      </div>
      <div class="preset-card__input">
        <Prepend>Size:</Prepend>
        <NumberInput value={size} />
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
