import './NumberInput.scss'
import { h, JSX } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import Prepend from './Prepend'
import { useReactiveState } from '@/util/reactivity'
import getTextWidth from '@/util/getTextWidth'
import TextStyle from '@/models/presentation/slideObjects/base/TextStyle'

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
    value,
    lastSymbol: '',
  })

  const box = useRef(null)

  const rerenderInput = function (value: number | string) {
    if (typeof value == 'string') value = parseFloat(value)
    box.current.value = value

    const textStyle = new TextStyle()
    textStyle.fontFamily = 'Roboto'
    textStyle.fontSize = 12
    textStyle.fontWeight = 700
    box.current.style.width = getTextWidth(textStyle, value.toString()) + 4 + 'px'
  }

  const applyRange = function (value: string | number): number {
    if (typeof value == 'string') return applyRange(parseFloat(value))
    if (value > maxValue) return maxValue
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

  if (value != state.value) state.value = parseFloat(applyStep(applyRange(value)))

  const onKeyPress = function (event: KeyboardEvent) {
    state.lastSymbol = event.key
  }

  const processText = function (text: string | number) {
    if (typeof text == 'number') return processText(text.toString())

    let parsedText = parseFloat(text.replace(',', '.'))
    if (isNaN(parsedText)) text = '0'

    let processedText = applyStep(applyRange(text))
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
    if (text == '' && state.lastSymbol == '.') return

    const processedText = processText(text)
    rerenderInput(processedText)

    state.value = parseFloat(processedText)
    onChange?.(state.value)
  }

  const onWheel = function (event: WheelEvent) {
    event.preventDefault()
    let delta = 0
    if (event.deltaY < 0) delta = 10
    if (event.deltaY > 0) delta = -10

    state.value = applyRange(state.value + delta)
    onChange?.(state.value)
    rerenderInput(state.value)
  }

  useEffect(() => {
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
          value={value}
          ref={box}
          onClick={(event) => event.stopPropagation()}
          onInput={onInput}
          onKeyDown={onKeyPress}
        ></input>
      </div>
    </div>
  )
}
export default NumberInput
