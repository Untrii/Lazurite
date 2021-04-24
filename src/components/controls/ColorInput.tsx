import './ColorInput.scss'
import Color from '@/models/common/Color'
import useDelayedUnmount from '@/util/hooks/useDelayedUnmount'
import { h, Fragment } from 'preact'
import { useState } from 'preact/hooks'
import ColorPicker from '../dialogs/ColorPicker'
import Prepend from './Prepend'

interface IColorInputProperies {
  value?: Color
  prepend?: string
  className?: string
  onChange?: (color: Color) => void
}

const ColorInput = ({ value = new Color(), prepend, className = '', onChange }: IColorInputProperies) => {
  const [isPickerShown, setPickerShown] = useState(false)

  const onColorPicked = function (color: Color) {
    setPickerShown(false)
    onChange?.(color)
  }

  const toggleInput = function () {
    setPickerShown(!isPickerShown)
  }

  const picker = useDelayedUnmount(
    <ColorPicker
      initialColor={value}
      mode="color"
      onColorPicked={onColorPicked}
      onCancel={() => setPickerShown(false)}
      isHiding={!isPickerShown}
    ></ColorPicker>,
    isPickerShown,
    500
  )

  const rootClasses = `color-input ${className}`

  return (
    <>
      <div class={rootClasses}>
        {prepend ? <Prepend>{prepend}</Prepend> : null}
        <div class="color-input__preview" style={{ background: value.toCssColor() }} onClick={toggleInput}></div>
      </div>
      <div style="height: 0px; width:0; float: right">
        <div style=" float: right">{picker}</div>
      </div>
    </>
  )
}
export default ColorInput
