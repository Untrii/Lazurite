import './ColorPicker.scss'

import { h, JSX } from 'preact'

import Color from '@/models/common/Color'
import { useReactiveState } from '@/util/reactivity'
import { hsvToRgb, rgbToHsv } from '@/util/color/colorConvertion'

import Prepend from '../controls/Prepend'
import Button from '../controls/Button'
import NumberInput from '../controls/NumberInput'
import { useEffect } from 'preact/hooks'
import AnimatedDialogBox from './AnimatedDialogBox'
import TextInput from '../controls/TextInput'

interface IColor {
  r: number
  g: number
  b: number
}

type ColorStop = {
  position: number
  value: IColor | 'current'
}

interface IColorPickerProps {
  onCancel?: () => void
  onColorPicked?: (color: Color) => void
  onGradientPicked?: (gradient: string) => void
  mode?: 'color' | 'gradient'
  initialColor?: Color
  isHiding?: boolean
}

function createDrag(handler: (startEvent: MouseEvent, currentEvent: MouseEvent) => void) {
  let startEvent = null as MouseEvent
  return function (event: MouseEvent) {
    startEvent = event
    event.stopPropagation()
    handler(event, event)

    const onMouseMove = function (event: MouseEvent) {
      handler(startEvent, event)
    }

    const onMouseUp = function (event: MouseEvent) {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }
}

const ColorPicker = ({
  onCancel,
  onColorPicked,
  onGradientPicked,
  mode = 'color',
  initialColor = Color.fromRgb(255, 0, 0),
  isHiding,
}: IColorPickerProps) => {
  const state = useReactiveState(() => {
    const { r, g, b } = initialColor
    const [hue, saturation, value] = rgbToHsv(r, g, b)

    return {
      lastHexValue: initialColor.toHex(),
      hue,
      saturation,
      value,
      red: r,
      green: g,
      blue: b,
      stops: [
        {
          position: 0.5,
          value: 'current',
        },
      ] as ColorStop[],
      gradientAngle: 135,
      isAnyStopFocused: false,
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

  const getStopColor = function (stop: ColorStop) {
    if (stop.value == 'current') return `rgb(${state.red}, ${state.green}, ${state.blue})`
    else return `rgb(${Object.values(stop.value).join(',')})`
  }

  const getGradient = function (ignoreAngle = false, compact = false) {
    const stops = state.stops
    const firstStop = stops[0]
    const lastStop = stops[stops.length - 1]
    const stopSrings = state.stops.map((item) => `${getStopColor(item)} ${item.position * 100}%`)
    const angle = ignoreAngle ? 'to right' : state.gradientAngle + 'deg'
    const compactVaraint = `${angle}, ${getStopColor(firstStop)} 0%, ${stopSrings}, ${getStopColor(lastStop)} 100%`

    if (compact) return compactVaraint
    else return `linear-gradient(${compactVaraint})`
  }

  const onChange = function (fieldName: keyof typeof state, value: any) {
    ;(state as any)[fieldName] = value
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

    let startSaturation = 0
    let startValue = 0
    const onSvSelectorPress = createDrag((startEvent, event) => {
      if (startEvent === event) {
        startSaturation = state.saturation
        startValue = state.value
      } else {
        const startX = startEvent.clientX
        const startY = startEvent.clientY

        const deltaX = event.clientX - startX
        const deltaY = event.clientY - startY
        const deltaValue = (deltaY / svDragSize) * 100
        const deltaSaturation = (deltaX / svDragSize) * 100

        const value = Math.round(Math.max(0, Math.min(startValue - deltaValue, 100)))
        const saturation = Math.round(Math.max(0, Math.min(startSaturation + deltaSaturation, 100)))

        onChange('value', value)
        onChange('saturation', saturation)
      }
    })

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
    let startHue = 0
    const onHueSelectorPress = createDrag((startEvent, event) => {
      if (startEvent === event) {
        startHue = state.hue
      } else {
        const delta = event.clientX - startEvent.clientX
        const deltaHue = (delta / 140) * 360
        const hue = Math.round(Math.max(0, Math.min(startHue + deltaHue, 360)))
        onChange('hue', hue)
      }
    })

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
    const currentColor = Color.fromRgb(state.red, state.green, state.blue)
    let hexValue = currentColor.toHex()
    const parsedColor = Color.fromHex(state.lastHexValue ?? '')
    if (!parsedColor || currentColor.equals(parsedColor)) hexValue = state.lastHexValue

    const onHexInput = function (value: string) {
      state.lastHexValue = value
      const color = Color.fromHex(value)
      if (!color) return
      onChange('red', color.r)
      onChange('green', color.g)
      onChange('blue', color.b)
    }

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
          <TextInput value={hexValue} onChange={onHexInput} />
        </div>
      </div>
    )
  }

  const renderBottomPanel = function () {
    let previewStyle

    if (mode == 'color')
      previewStyle = {
        backgroundColor: `rgb(${state.red},${state.green},${state.blue})`,
      }
    else
      previewStyle = {
        background: getGradient(),
      }

    const onPicked = function () {
      if (mode == 'color') onColorPicked?.(Color.fromRgb(state.red, state.green, state.blue))
      else onGradientPicked?.(getGradient(false, true))
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

  const clearCurrent = function () {
    const stops = state.stops
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i]
      if (stop.value == 'current') {
        stop.value = {
          r: state.red,
          g: state.green,
          b: state.blue,
        }
      }
    }
  }

  const setCurrent = function (stop: ColorStop) {
    if (stop.value != 'current') {
      const { r, g, b } = stop.value
      onChange('red', r)
      onChange('green', g)
      onChange('blue', b)

      stop.value = 'current'
    }
  }

  const getCurrentStop = function () {
    for (const stop of state.stops) {
      if (stop.value == 'current') return stop
    }
  }

  const renderGradientControls = function () {
    const renderStopBar = function () {
      const pointers = [] as JSX.Element[]

      const onStopPointerPress = (event: MouseEvent, currentStop: ColorStop) => {
        let stopStartPos = currentStop.position
        clearCurrent()
        setCurrent(currentStop)
        createDrag((startEvent, event) => {
          if (startEvent === event) {
            state.isAnyStopFocused = true
          }
          if (startEvent !== event) {
            const delta = event.clientX - startEvent.clientX
            const deltaPos = delta / 140
            const stop = getCurrentStop()
            if (stop) stop.position = Math.max(0, Math.min(stopStartPos + deltaPos, 1))
            state.stops.sort((a, b) => a.position - b.position)
          }
        })(event)
      }

      const onStopBarPress = function (event: MouseEvent) {
        const stops = state.stops

        let offsetX = Math.max(0, Math.min(event.offsetX - 6, 140))
        let percentPosition = offsetX / 140
        let afterStop = -1
        for (; afterStop < stops.length - 1; afterStop++) {
          const stop = stops[afterStop + 1]
          if (stop.position > percentPosition) break
        }

        clearCurrent()

        const firstStop = stops[0]
        const lastStop = stops[stops.length - 1]
        const prevStop = stops[afterStop]
        const nextStop = stops[afterStop + 1]
        let copyFrom: IColor

        if (afterStop == -1 && firstStop.value != 'current') copyFrom = firstStop.value
        else if (afterStop == stops.length - 1 && lastStop.value != 'current') copyFrom = lastStop.value
        else if (prevStop.value != 'current') {
          copyFrom = { ...prevStop.value }
          const relativePos = (percentPosition - prevStop.position) / (nextStop.position - prevStop.position)
          ;(['r', 'g', 'b'] as (keyof IColor)[]).map(
            (item) => (copyFrom[item] += (nextStop.value[item] - prevStop.value[item]) * relativePos)
          )
        }
        if (copyFrom) {
          const newStop = {
            position: percentPosition,
            value: 'current',
          } as ColorStop
          stops.push(newStop)
          onStopPointerPress(event, state.stops[stops.length - 1])

          stops.sort((a, b) => a.position - b.position)

          onChange('red', Math.floor(copyFrom.r))
          onChange('green', Math.floor(copyFrom.g))
          onChange('blue', Math.floor(copyFrom.b))
        }
      }

      for (let i = 0; i < state.stops.length; i++) {
        const currentStop = state.stops[i]

        const stopStyle = {
          backgroundColor: getStopColor(currentStop),
          transform: `translateX(${currentStop.position * 140}px) translateY(${-12 * i}px)`,
        }

        if (state.isAnyStopFocused && currentStop.value == 'current') stopStyle.transform += ' scale(1.2)'

        pointers.push(
          <div
            class="color-picker__pointer"
            style={stopStyle}
            onMouseDown={(event) => onStopPointerPress(event, currentStop)}
          ></div>
        )
      }

      const barStyle = {
        background: getGradient(true),
      }

      return (
        <div class="color-picker__gradient-stops" style={barStyle} onMouseDown={onStopBarPress}>
          {pointers}
        </div>
      )
    }

    return (
      <div class="color-picker__gradient-controls">
        {renderStopBar()}
        <div class="color-picker__input" style="margin-top:6px">
          <Prepend>Angle:</Prepend>
          <NumberInput
            value={state.gradientAngle}
            minValue={0}
            maxValue={360}
            step={1}
            onChange={(value) => (state.gradientAngle = value)}
          />
        </div>
      </div>
    )
  }

  const deleteStop = function () {
    const stops = state.stops
    if (stops.length < 2 || !state.isAnyStopFocused) return
    let selectedStopIndex = 0
    for (let i = 0; i < stops.length; i++) {
      if (stops[i].value == 'current') {
        selectedStopIndex = i
        break
      }
    }
    stops.splice(selectedStopIndex, 1)
    if (stops.length > selectedStopIndex) setCurrent(stops[selectedStopIndex])
    else setCurrent(stops[selectedStopIndex - 1])
  }

  useEffect(() => {
    const onMousedown = () => (state.isAnyStopFocused = false)
    const onKeyDown = (event) => {
      if (event.key == 'Delete') deleteStop()
    }
    document.addEventListener('mousedown', onMousedown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMousedown)
      document.removeEventListener('keydown', onKeyDown)
    }
  })

  const width = 168
  const height = mode == 'color' ? 374 : 432

  return (
    <AnimatedDialogBox isHiding={isHiding} width={width} height={height}>
      {renderMainBox()}
      <div class="color-picker__edit-box">
        {renderHueSelector()}
        {renderInputs()}
        {mode == 'gradient' ? renderGradientControls() : null}
        {renderBottomPanel()}
      </div>
    </AnimatedDialogBox>
  )
}
export default ColorPicker
