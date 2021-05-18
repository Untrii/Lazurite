import './NumberInput.scss'

import { h, JSX } from 'preact'
import { useLayoutEffect, useRef } from 'preact/hooks'

import { useReactiveState } from 'common/util/reactivity'
import getTextWidth from 'common/util/text/getTextWidth'
import TextStyle from 'common/models/presentation/slideObjects/base/TextStyle'

import Prepend from './Prepend'

interface INumberInputProps {
  value?: number
  maxValue?: number
  minValue?: number
  step?: number
  precision?: number
  prepend?: string
  className?: string
  onChange?: (newValue: number) => void
}

const NumberInput = ({
  value = 0,
  minValue = -1e9,
  maxValue = 1e9,
  step = 1,
  precision = 0.1,
  prepend,
  className = '',
  onChange,
}: INumberInputProps) => {
  const state = useReactiveState({
    prevPropsValue: NaN,
    value: NaN,
    prevValue: value,
    emptyValue: false,
  })
  const fractionsCount = Math.round(Math.log10(1 / precision))

  if (isNaN(value)) value = minValue

  const box = useRef(null)

  const applyMaxValue = function (value: string | number): number {
    if (typeof value == 'string') return applyMaxValue(parseFloat(value))
    if (value > maxValue) return maxValue
    return value
  }

  const applyMinValue = function (value: number) {
    if (value < minValue) return minValue
    return value
  }

  const applyPrecision = function (value: string | number): string {
    if (typeof value == 'number') return applyPrecision(value.toString())
    const dividerIndex = value.indexOf('.')
    let result = value
    if (dividerIndex != -1) result = value.substring(0, dividerIndex + fractionsCount + 1)
    if (result != value) return result
    return value
  }

  const renderValue = function (value: number) {
    let text = value.toFixed(fractionsCount)
    if (text.includes('.')) {
      while (text.endsWith('0')) text = text.substring(0, text.length - 1)
      if (text.endsWith('.')) text = text.substring(0, text.length - 1)
    }

    box.current.value = text
  }

  const processText = function (text: string | number) {
    if (typeof text == 'number') return processText(text.toString())

    let parsedText = parseFloat(text.replace(',', '.'))
    if (isNaN(parsedText)) text = '0'

    let processedText = applyPrecision(applyMaxValue(text))
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
    const value = parseFloat(processedText)

    if (box.current.value.length > processedText.length) renderValue(value)

    if (state.value != value) {
      state.value = value
      if (value >= minValue) onChange?.(value)
    }
  }

  const incrementValue = function (delta: number) {
    const value = applyMinValue(applyMaxValue(state.value + delta))
    state.value = value
    renderValue(value)
    onChange?.(value < minValue ? minValue : value)
  }

  const onWheel = function (event: WheelEvent) {
    event.preventDefault()
    let delta = 0
    if (event.deltaY < 0) delta = 10
    if (event.deltaY > 0) delta = -10

    incrementValue(delta)
  }

  const onKeyDown = function (event: KeyboardEvent) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',']
    if (!allowedKeys.includes(event.key) && !event.ctrlKey && event.code != event.key) {
      event.preventDefault()
    }
    if (event.code == 'ArrowUp' || event.code == 'ArrowDown') {
      const delta = event.code == 'ArrowUp' ? 1 : -1
      incrementValue(delta)
    }
  }

  const rootClasses = `number-input ${className}`

  useLayoutEffect(() => {
    if (state.value != value) {
      state.value = value
      renderValue(value)
    }
  })

  return (
    <div class={rootClasses}>
      {prepend ? <Prepend>{prepend}</Prepend> : null}
      <div class="number-input__edit-box" onClick={() => box.current.focus()} onWheel={onWheel}>
        <input
          lang="en"
          step={precision}
          min={minValue}
          max={maxValue}
          ref={box}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={onKeyDown}
          onInput={onInput}
        ></input>
      </div>
    </div>
  )
}
export default NumberInput
