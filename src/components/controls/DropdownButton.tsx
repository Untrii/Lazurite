import './DropdownButton.scss'
import { h } from 'preact'
import { useState } from 'preact/hooks'
import DropdownSelector from './DropdownSelector'
import assets from '@/assets'

interface IDropdownButtonProps {
  blockLevel?: boolean
  colorName?: string
  variants?: string[]
  defaultVariant?: string
  groupName?: string
  icons?: (string | undefined)[]
  className?: string
  onClick?: (variantIndex: number, variantName: string) => void
  onDefaultClick?: () => void
}

const DropdownButton = ({
  blockLevel,
  colorName = 'blue-400',
  variants = [],
  defaultVariant,
  groupName = 'Choose variant',
  icons = [],
  className = '',
  onClick,
  onDefaultClick,
}: IDropdownButtonProps) => {
  let buttonClasses = ['lz-dd-button', 'control-bg_' + colorName]
  if (blockLevel) buttonClasses.push('lz-dd-button_block')
  if (className) buttonClasses.push(className)

  const [isDropdownOpened, toggleDropdown] = useState(false)

  if (defaultVariant) {
    buttonClasses.push('lz-dd-button_with-default')
    const upperClasses = ['control-bg_' + colorName, 'lz-dd-button__default']
    const bottomClassses = ['control-bg_' + colorName, 'lz-dd-button__dropdown']

    if (isDropdownOpened) bottomClassses.push('lz-dd-button__dropdown_opened')

    const onDropdownClick = (event) => {
      toggleDropdown(!isDropdownOpened)
      event.stopPropagation()
    }

    return (
      <div class={buttonClasses.join(' ')}>
        <button
          class={upperClasses.join(' ') + ' border-dark_' + colorName}
          onClick={() => (onDefaultClick ? onDefaultClick() : null)}
        >
          {defaultVariant}
        </button>
        <button class={bottomClassses.join(' ')} onClick={onDropdownClick}>
          <span style="grid-column:3">{groupName}</span>
          <img src={assets.arrowDown} style="grid-column:4" alt="" />
        </button>
        <DropdownSelector
          onClose={() => toggleDropdown(false)}
          variants={variants}
          colorName={colorName}
          visible={isDropdownOpened}
          onClick={(index) => (onClick ? onClick(index, variants[index]) : null)}
        />
      </div>
    )
  }
  return <button class={buttonClasses.join(' ')}></button>
}
export default DropdownButton
