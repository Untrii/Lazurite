import './SearchBox.scss'
import { h } from 'preact'

interface ISearchBoxProps {
  onInput?: (value: string) => void
  colorName?: string
  placeholder?: string
}

const SearchBox = ({ onInput, colorName = 'blue-300', placeholder = 'Input text...' }: ISearchBoxProps) => {
  return (
    <input
      type="text"
      class={'search-box bg_' + colorName}
      placeholder={placeholder}
      onInput={(event) => onInput?.((event.target as any).value)}
    />
  )
}
export default SearchBox
