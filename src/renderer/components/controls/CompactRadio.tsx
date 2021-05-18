import './CompactRadio.scss'

import { h } from 'preact'

import Prepend from './Prepend'

export interface IRadioVariant {
  displayName: string
  icon: string
}

interface ICompactRadioProps {
  prepend?: string
  variants: IRadioVariant[]
  selectedVariantIndex?: number
  colorName?: string
  className?: string
  onSelected?: (index: number) => void
}

const CompactRadio = ({
  prepend,
  colorName = 'blue-400',
  variants,
  selectedVariantIndex = 0,
  className = '',
  onSelected,
}: ICompactRadioProps) => {
  const renderVariant = function (variant: IRadioVariant, index: number) {
    const variantClasses: string[] = ['compact-radio__variant', 'control-bg_' + colorName, 'border-dark_' + colorName]
    if (index == selectedVariantIndex) variantClasses.push('pressed-control-bg_' + colorName)
    return (
      <div class={variantClasses.join(' ')} onClick={() => onSelected?.(index)}>
        <img src={variant.icon} alt={variant.displayName} />
      </div>
    )
  }

  const rootClasses = `compact-radio ${className}`

  return (
    <div class={rootClasses}>
      {prepend ? <Prepend>{prepend}</Prepend> : null}
      <div class="compact-radio__variants">{variants.map((value, index) => renderVariant(value, index))}</div>
    </div>
  )
}
export default CompactRadio
