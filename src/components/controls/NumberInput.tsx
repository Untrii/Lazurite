import './NumberInput.scss'
import { h, JSX } from 'preact'
import { useRef, useState } from 'preact/hooks'
import Prepend from './Prepend'
import { useReactiveState } from '@/util/reactivity'

interface INumberInputProps {
  value?: number
  maxValue?: number
  minValue?: number
  step?: number
  prepend?: string
}

const NumberInput = ({ value = 0, minValue = -1e9, maxValue = 1e9, step = 0.1, prepend }: INumberInputProps) => {
  const [initialValue] = useState(value)
  const state = useReactiveState({
    value,
  })
  const box = useRef(null)

  const rerenderInput = function (text: string) {
    box.current.innerText = text
    document.getSelection().setPosition(box.current, 1)
  }

  const applyRange = function (value: number) {
    if (value == 0) return 0
    return Math.min(maxValue, Math.max(minValue, value))
  }

  const applyStep = function (value: number) {
    const fractionsCount = Math.round(Math.log10(1 / step))
    const valueString = value.toString()
    const dividerIndex = valueString.indexOf('.')
    if (dividerIndex != -1) return valueString.substring(0, dividerIndex + fractionsCount + 1)
    return valueString
  }

  const onKeyPress = function (event: KeyboardEvent) {
    const text: string = (event.target as any).innerText

    const isAllowedKey = function () {
      let result = false
      const { key } = event

      if (key >= '0' && key <= '9') result = true
      if ((key == ',' || key == '.' || key == '-') && !(text.includes('.') || text.includes(','))) result = true
      if (key.startsWith('Arrow')) result = true
      if (key == 'Delete' || event.key == 'Backspace') result = true
      if (event.ctrlKey) result = true
      return result
    }

    if (isAllowedKey()) return
    else event.preventDefault()
  }

  const processText = function (text: string | number) {
    if (typeof text == 'number') return processText(text.toString())

    let parsedText = parseFloat(text.replace(',', '.'))
    if (isNaN(parsedText)) parsedText = 0

    let processedText = applyStep(applyRange(parsedText))
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
    const target = event.target as HTMLDivElement
    const text: string = target.innerText
    const processedText = processText(text)

    if (text != processedText) rerenderInput(processedText)

    state.value = parseFloat(processedText)
  }

  const onWheel = function (event: WheelEvent) {
    state.value += event.deltaY / 10
    rerenderInput(processText(state.value))
  }

  return (
    <div class="number-input">
      {prepend ? <Prepend>{prepend}</Prepend> : null}
      <div class="number-input__edit-box" onClick={() => box.current.focus()} onWheel={onWheel}>
        <div
          ref={box}
          contentEditable={true}
          onClick={(event) => event.stopPropagation()}
          onInput={onInput}
          onKeyDown={onKeyPress}
        >
          {initialValue}
        </div>
      </div>
    </div>
  )
}
export default NumberInput
