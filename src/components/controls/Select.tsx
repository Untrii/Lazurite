import './Select.scss'
import assets from '@/assets'
import { h, Fragment } from 'preact'
import { useState } from 'preact/hooks'
import DropdownSelector from './DropdownSelector'
import Prepend from './Prepend'

interface ISelectProps {
  value?: number
  options?: { displayName: string; value: any }[]
  placeholder?: string
  colorName?: string
  prepend?: string
  className?: string
  onSelect?: (value: any) => void
}

const Select = ({
  value = -1,
  options = [],
  placeholder = '',
  colorName = 'blue-400',
  prepend,
  className = '',
  onSelect,
}: ISelectProps) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false)

  const toggleDropdown = function (event: Event) {
    event.stopPropagation()
    setDropdownVisible(!isDropdownVisible)
  }

  const onClick = function (index: number) {
    onSelect?.(options[index].value)
    setDropdownVisible(false)
  }

  const rootClasses = `select ${className}`

  return (
    <>
      <div class={rootClasses}>
        {prepend ? <Prepend>{prepend}</Prepend> : null}
        <input
          value={options.find((item) => item.value == value)?.displayName ?? placeholder}
          type="text"
          readonly
          placeholder={placeholder}
          onClick={toggleDropdown}
        />
        <img src={assets.arrowDown} onClick={toggleDropdown} alt="" />
      </div>
      <DropdownSelector
        colorName={colorName}
        visible={isDropdownVisible}
        variants={options.map((item) => item.displayName)}
        onClose={() => setDropdownVisible(false)}
        onClick={onClick}
      ></DropdownSelector>
    </>
  )
}
export default Select
