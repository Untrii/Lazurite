import './Button.scss'

import { h } from 'preact'

interface IButtonProps {
  blockLevel?: boolean
  colorName?: string
  text?: string
  icon?: string
  className?: string
  onClick?: () => void
  size?: 'small' | 'large'
}

const Button = ({
  blockLevel = false,
  colorName = 'blue-400',
  text = '',
  icon,
  className,
  onClick,
  size = 'small',
}: IButtonProps) => {
  let buttonClasses = ['lz-button', 'control-bg_' + colorName]
  if (blockLevel) buttonClasses.push('lz-button_block')
  if (text.length == 0) buttonClasses.push('lz-button_no-text')
  if (size == 'large') buttonClasses.push('lz-button_size_large')
  if (className) buttonClasses.push(className)

  return (
    <button class={buttonClasses.join(' ')} onClick={() => onClick?.()}>
      {icon ? <img src={icon} alt="" /> : null}
      {text}
    </button>
  )
}

export default Button
