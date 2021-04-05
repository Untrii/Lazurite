import './Button.scss'

import { h } from 'preact'

interface IButtonProps {
  blockLevel?: boolean
  centred?: boolean
  pressed?: boolean
  colorName?: string
  text?: string
  icon?: string
  iconScale?: number
  className?: string
  onClick?: () => void
  size?: 'small' | 'large'
}

const Button = ({
  blockLevel = false,
  centred = false,
  pressed = false,
  colorName = 'blue-400',
  text = '',
  icon,
  iconScale = 1,
  className,
  onClick,
  size = 'small',
}: IButtonProps) => {
  let buttonClasses = ['lz-button', 'control-bg_' + colorName]
  if (blockLevel) buttonClasses.push('lz-button_block')
  if (centred) buttonClasses.push('lz-button_centred')
  if (pressed) buttonClasses.push('pressed-control-bg_' + colorName)
  if (text.length == 0) buttonClasses.push('lz-button_no-text')
  if (size == 'large') buttonClasses.push('lz-button_size_large')
  if (className) buttonClasses.push(className)

  return (
    <button class={buttonClasses.join(' ')} onClick={() => onClick?.()}>
      {icon ? (
        <div class="lz-button__icon-box">
          <img src={icon} alt="" style={`transform: scale(${iconScale})`} />
        </div>
      ) : null}
      {text}
    </button>
  )
}

export default Button
