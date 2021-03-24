import './FontList.scss'
import SearchBox from '@/components/controls/SearchBox'
import Font from '@/models/common/Font'
import Searcher from '@/util/Searcher'
import { h } from 'preact'
import { useState } from 'preact/hooks'
import FontCard from './FontCard'
import * as design from '@/store/actions/design'

interface IFontListProps {
  fonts: Font[]
  onSelect: (index: number) => void
  onSelectForAll: (index: number) => void
}

const FontList = ({ fonts, onSelect, onSelectForAll }: IFontListProps) => {
  const [query, setQuery] = useState('')

  const [searcher, setSearcher] = useState(null as Searcher<Font>)
  const visibleElements = searcher?.search?.(query) ?? new Set<number>()

  if (fonts.length > 0 && !searcher) setSearcher(new Searcher(fonts, (element) => element.name.toLowerCase()))

  return (
    <div class="font-list">
      <div class="font-list__searchbox">
        <SearchBox onInput={setQuery} placeholder="Search for font" />
        <span class="font-list__searchbox-count">Found: {visibleElements.size}</span>
      </div>
      <div class="font-list__items">
        {fonts.map((font, index) =>
          visibleElements.has(index) ? (
            <FontCard
              key={font.name}
              preview={font.previewSource}
              variants={font.types}
              weights={font.weights}
              onSelectForAll={() => onSelectForAll(index)}
              onSelectForCurrent={() => onSelect(index)}
            />
          ) : null
        )}
      </div>
    </div>
  )
}
export default FontList
