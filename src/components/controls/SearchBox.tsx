import './SearchBox.scss'
import { h } from 'preact'

interface ISearchBoxProps {
  onChange?: (value: string) => void
  colorName?: string
  placeholder?: string
}

const SearchBox = ({ onChange, colorName = 'blue-300', placeholder = 'Input text...' }: ISearchBoxProps) => {
  return (
    <input
      type="text"
      class={'search-box bg_' + colorName}
      placeholder={placeholder}
      onChange={(event) => onChange?.((event.target as any).value)}
    />
  )
}
export default SearchBox
