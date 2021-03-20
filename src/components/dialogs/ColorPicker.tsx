import './ColorPicker.scss'

import { h } from 'preact'

import Color from '@/models/common/Color'
import { useReactiveState } from '@/util/reactivity'
import { hsvToRgb, rgbToHsv } from '@/util/colorConvertion'

import Prepend from '../controls/Prepend'
import Button from '../controls/Button'
import NumberInput from '../controls/NumberInput'
import { useEffect } from 'preact/hooks'

interface IColorPickerProps {
  onCancel?: () => void
  onColorPicked?: (color: Color) => void
  mode?: 'color' | 'gradient'
  initialColor?: Color
  isHiding?: boolean
}

const ColorPicker = ({
  onCancel,
  onColorPicked: onColorPicked,
  mode = 'color',
  initialColor = Color.fromRgb(255, 0, 0),
  isHiding,
}: IColorPickerProps) => {
  const state = useReactiveState(() => {
    const { r, g, b } = initialColor
    const [hue, saturation, value] = rgbToHsv(r, g, b)
    requestAnimationFrame(() => state.rootClasses.push('color-picker_visible'))

    return {
      hue,
      saturation,
      value,
      red: r,
      green: g,
      blue: b,

      rootClasses: ['color-picker'],
    }
  })

  const maxValues = {
    hue: 360,
    saturation: 100,
    value: 100,
    red: 255,
    green: 255,
    blue: 255,
  }

  const clearColor = hsvToRgb(state.hue, 100, 100)

  const onChange = function (fieldName: keyof typeof state, value) {
    state[fieldName] = value
    switch (fieldName) {
      case 'blue':
      case 'green':
      case 'red': {
        const { red, green, blue } = state
        const [h, s, v] = rgbToHsv(red, green, blue)
        state.hue = Math.round(h)
        state.saturation = Math.round(s)
        state.value = Math.round(v)
        break
      }
      case 'hue':
      case 'saturation':
      case 'value': {
        const { hue, saturation, value } = state
        const [r, g, b] = hsvToRgb(hue, saturation, value)
        state.red = Math.round(r)
        state.green = Math.round(g)
        state.blue = Math.round(b)
        break
      }
    }
  }

  const renderMainBox = function () {
    const svDragSize = 154

    const onSvSelectorPress = function (event: MouseEvent) {
      const startX = event.clientX
      const startY = event.clientY
      const startSaturation = state.saturation
      const startValue = state.value

      event.stopPropagation()

      const onMouseMove = function (event: MouseEvent) {
        const deltaX = event.clientX - startX
        const deltaY = event.clientY - startY
        const deltaValue = (deltaY / svDragSize) * 100
        const deltaSaturation = (deltaX / svDragSize) * 100

        const value = Math.round(Math.max(0, Math.min(startValue - deltaValue, 100)))
        const saturation = Math.round(Math.max(0, Math.min(startSaturation + deltaSaturation, 100)))

        onChange('value', value)
        onChange('saturation', saturation)
      }

      const onMouseUp = function (event: MouseEvent) {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onSvSelectorFieldPress = function (event: MouseEvent) {
      let offsetX = Math.max(0, Math.min(event.offsetX - 6, svDragSize))
      let offsetY = Math.max(0, Math.min(event.offsetY - 6, svDragSize))

      onChange('value', Math.round(100 - (offsetY / svDragSize) * 100))
      onChange('saturation', Math.round((offsetX / svDragSize) * 100))

      onSvSelectorPress(event)
    }

    const mainBoxSaturationStyle = {
      background: `linear-gradient(to right, white 3.75%, rgb(${clearColor.join(',')}) 96.25%)`,
    }

    const svSelectorStyle = {
      backgroundColor: `rgb(${state.red},${state.green},${state.blue})`,
      transform: `translateX(${(state.saturation * svDragSize) / 100}px) translateY(${
        ((100 - state.value) * svDragSize) / 100
      }px)`,
    }

    return (
      <div class="color-picker__main-box" onMouseDown={onSvSelectorFieldPress}>
        <div class="color-picker__main-box-saturation" style={mainBoxSaturationStyle}>
          <div class="color-picker__main-box-value">
            <div class="color-picker__pointer" style={svSelectorStyle} onMouseDown={onSvSelectorPress}></div>
          </div>
        </div>
      </div>
    )
  }

  const renderHueSelector = function () {
    const onHueSelectorPress = function (event: MouseEvent) {
      const startPos = event.clientX
      const startHue = state.hue
      event.stopPropagation()

      const onMouseMove = function (event: MouseEvent) {
        const delta = event.clientX - startPos
        const deltaHue = (delta / 140) * 360
        const hue = Math.round(Math.max(0, Math.min(startHue + deltaHue, 360)))
        onChange('hue', hue)
      }

      const onMouseUp = function (event: MouseEvent) {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onHueSelectorBarPress = function (event: MouseEvent) {
      let offsetX = Math.max(0, Math.min(event.offsetX - 6, 140))
      onChange('hue', Math.round((offsetX / 140) * 360))
      onHueSelectorPress(event)
    }

    const hueSelectorStyle = {
      backgroundColor: `rgb(${clearColor.join(',')})`,
      transform: `translateX(${(140 * state.hue) / 360}px)`,
    }

    return (
      <div class="color-picker__hue-selector" onMouseDown={onHueSelectorBarPress}>
        <div class="color-picker__pointer" style={hueSelectorStyle} onMouseDown={onHueSelectorPress}></div>
      </div>
    )
  }

  const renderInputs = function () {
    return (
      <div class="color-picker__inputs">
        <div class="color-picker__input">
          <Prepend>RGB:</Prepend>
          {['red', 'green', 'blue'].map((item) => (
            <NumberInput
              value={state[item]}
              minValue={0}
              maxValue={maxValues[item]}
              step={1}
              onChange={(value) => onChange(item as keyof typeof state, value)}
            />
          ))}
        </div>
        <div class="color-picker__input">
          <Prepend>HSV:</Prepend>
          {['hue', 'saturation', 'value'].map((item) => (
            <NumberInput
              value={state[item]}
              minValue={0}
              maxValue={maxValues[item]}
              step={1}
              onChange={(value) => onChange(item as keyof typeof state, value)}
            />
          ))}
        </div>
        <div class="color-picker__input">
          <Prepend>Hex:</Prepend>
          not implemented
        </div>
      </div>
    )
  }

  const renderBottomPanel = function () {
    const previewStyle = {
      backgroundColor: `rgb(${state.red},${state.green},${state.blue})`,
    }

    const onPicked = function () {
      if (mode == 'color') onColorPicked?.(Color.fromRgb(state.red, state.green, state.blue))
    }
    return (
      <div class="color-picker__bottom-panel">
        <div class="color-picker__preview" style={previewStyle}></div>
        <div class="color-picker__buttons">
          <Button blockLevel text="Cancel" className="color-picker__button" colorName="blue-600" onClick={onCancel} />
          <Button blockLevel text="OK" className="color-picker__button" colorName="blue-600" onClick={onPicked} />
        </div>
      </div>
    )
  }

  if (isHiding) {
    state.rootClasses = ['color-picker', 'color-picker_hidden']
  }

  return (
    <div class={state.rootClasses.join(' ')}>
      {renderMainBox()}
      <div class="color-picker__edit-box">
        {renderHueSelector()}
        {renderInputs()}
        {renderBottomPanel()}
      </div>
    </div>
  )
}
export default ColorPicker
