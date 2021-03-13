import './DropdownButton.scss'
import { h } from 'preact'

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

  if (defaultVariant) {
    buttonClasses.push('lz-dd-button_with-default')
    const upperClasses = ['control-bg_' + colorName, 'lz-dd-button__default']
    const bottomClassses = ['control-bg_' + colorName, 'lz-dd-button__dropdown']
    return (
      <div class={buttonClasses.join(' ')}>
        <button class={upperClasses.join(' ') + ' border-dark_' + colorName}>{defaultVariant}</button>
        <button class={bottomClassses.join(' ')}>{groupName}</button>
      </div>
    )
  }
  return <button class={buttonClasses.join(' ')}></button>
}
export default DropdownButton
