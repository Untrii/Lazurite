import './NumberInput.scss'

import { h, JSX } from 'preact'
import { useLayoutEffect, useRef } from 'preact/hooks'

import { useReactiveState } from '@/util/reactivity'
import getTextWidth from '@/util/getTextWidth'
import TextStyle from '@/models/presentation/slideObjects/base/TextStyle'

import Prepend from './Prepend'

interface INumberInputProps {
  value?: number
  maxValue?: number
  minValue?: number
  step?: number
  prepend?: string
  onChange?: (newValue: number) => void
}

const NumberInput = ({
  value = 0,
  minValue = -1e9,
  maxValue = 1e9,
  step = 0.001,
  prepend,
  onChange,
}: INumberInputProps) => {
  const state = useReactiveState({
    prevPropsValue: NaN,
    value,
    prevValue: value,
    emptyValue: false,
  })

  if (isNaN(value)) value = minValue

  const box = useRef(null)

  const rerenderInput = function (value: number | string) {
    if (typeof value == 'number') return rerenderInput(value.toString())

    const textStyle = new TextStyle()
    textStyle.fontFamily = 'Roboto'
    textStyle.fontSize = 12
    textStyle.fontWeight = 700
    box.current.style.width = getTextWidth(textStyle, value) + 4 + 'px'
  }

  const applyMaxValue = function (value: string | number): number {
    if (typeof value == 'string') return applyMaxValue(parseFloat(value))
    if (value > maxValue) return maxValue
    return value
  }

  const applyMinValue = function (value: number) {
    if (value < minValue) return minValue
    return value
  }

  const applyStep = function (value: string | number): string {
    if (typeof value == 'number') return applyStep(value.toString())
    const fractionsCount = Math.round(Math.log10(1 / step))
    const dividerIndex = value.indexOf('.')
    let result = value
    if (dividerIndex != -1) result = value.substring(0, dividerIndex + fractionsCount + 1)
    if (result != value) return result
    return value
  }

  if (value != state.prevPropsValue) {
    state.value = parseFloat(applyStep(applyMaxValue(value)))
    state.prevPropsValue = value
  }

  const processText = function (text: string | number) {
    if (typeof text == 'number') return processText(text.toString())

    let parsedText = parseFloat(text.replace(',', '.'))
    if (isNaN(parsedText)) text = '0'

    let processedText = applyStep(applyMaxValue(text))
    if (text.endsWith(',') || text.endsWith('.')) processedText += '.'

    if (text.startsWith('0') && text.length > 1) {
      let index = 0
      while (text[index] == '0') index++
      if (text[index] == ',' || text[index] == '.') index--
      if (index != 0) processedText = text.substring(index)
    }
    return processedText
  }

  const onInput: JSX.GenericEventHandler<HTMLDivElement> = function (event) {
    const target = event.target as HTMLInputElement
    const text: string = target.value
    if (text == '') {
      state.prevPropsValue = minValue
      state.prevValue = state.value
      state.emptyValue = true
      onChange?.(minValue)
      return
    }
    state.emptyValue = false

    const processedText = processText(text)

    state.value = parseFloat(processedText)
    onChange?.(state.value < minValue ? minValue : state.value)
  }

  const onWheel = function (event: WheelEvent) {
    event.preventDefault()
    let delta = 0
    if (event.deltaY < 0) delta = 10
    if (event.deltaY > 0) delta = -10

    state.value = applyMinValue(applyMaxValue(state.value + delta))
    onChange?.(state.value < minValue ? minValue : state.value)
  }

  useLayoutEffect(() => {
    rerenderInput(state.value)
  })

  return (
    <div class="number-input">
      {prepend ? <Prepend>{prepend}</Prepend> : null}
      <div class="number-input__edit-box" onClick={() => box.current.focus()} onWheel={onWheel}>
        <input
          lang="en"
          type="number"
          step={step}
          min={minValue}
          max={maxValue}
          value={state.emptyValue ? '' : state.value}
          ref={box}
          onClick={(event) => event.stopPropagation()}
          onInput={onInput}
        ></input>
      </div>
    </div>
  )
}
export default NumberInput
