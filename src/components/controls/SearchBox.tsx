import './SearchBox.scss'
import { h } from 'preact'

interface ISearchBoxProps {
  onInput?: (value: string) => void
  colorName?: string
  placeholder?: string
  maxLength?: number
}

const SearchBox = ({
  onInput,
  colorName = 'blue-300',
  placeholder = 'Input text...',
  maxLength = 40,
}: ISearchBoxProps) => {
  return (
    <input
      type="text"
      class={'search-box bg_' + colorName}
      placeholder={placeholder}
      onInput={(event) => onInput?.((event.target as any).value)}
      maxLength={maxLength}
    />
  )
}
export default SearchBox
