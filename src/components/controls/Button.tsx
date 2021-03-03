import './Button.scss'
import { h } from 'preact'

interface IButtonProps {
  blockLevel?: boolean
  colorName: string
  text?: string
  icon?: string
  className?: string
}

const LzButton = ({ blockLevel = false, colorName = 'blue-400', text = '', icon, className }: IButtonProps) => {
  let buttonClasses = ['lz-button', 'control-bg_' + colorName]
  if (blockLevel) buttonClasses.push('lz-button_block')
  if (text.length == 0) buttonClasses.push('lz-button_no-text')
  if (className) buttonClasses.push(className)

  return (
    <div class={buttonClasses.join(' ')}>
      {icon ? <img src={icon} alt="" /> : {}}
      {text}
    </div>
  )
}

export default LzButton
