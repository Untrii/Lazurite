import './TextPresetsEditor.scss'
import { h } from 'preact'
import io from '@/io'
import { requireResourceAsync } from '@/dataLoader'
import { useReactiveState } from '@/util/reactivity'
import Font from '@/models/common/Font'
import FontCard from './FontCard'
import SearchBox from '@/components/controls/SearchBox'
import { useState } from 'preact/hooks'
import Searcher from '@/util/Searcher'
import PresetCard from './PresetCard'
import Button from '@/components/controls/Button'
import PresetList from './PresetList'

async function preloadFontPreviews() {
  const startTime = Date.now()
  const fonts = await io.getFonts()
  await Promise.all(fonts.map((font) => requireResourceAsync(font.previewSource, 'svg')))
  console.info(`Loaded font preview in ${Date.now() - startTime}ms`)
}

preloadFontPreviews()

const TextPresetsEditor = () => {
  const state = useReactiveState({
    fonts: [] as Font[],
    query: '',
  })

  if (state.fonts.length == 0)
    io.getFonts().then((result) => {
      state.fonts = result
      setSearcher(new Searcher(result, (element) => element.name.toLowerCase()))
    })

  const [searcher, setSearcher] = useState(new Searcher<Font>([]))
  const visibleElements = searcher.search(state.query)

  return (
    <div class="text-presets-editor">
      <div class="text-presets-editor__font-list">
        <div class="text-presets-editor__font-list-searchbox">
          <SearchBox onInput={(value) => (state.query = value)} placeholder="Search for font" />
          <span class="text-presets-editor__font-list-searchbox-count">Found: {visibleElements.size}</span>
        </div>
        <div class="text-presets-editor__font-list-items">
          {state.fonts.map((font, index) =>
            visibleElements.has(index) ? (
              <FontCard
                key={font.name}
                preview={font.previewSource}
                variants={font.types}
                weights={font.weights}
                onSelectForAll={() => {}}
                onSelectForCurrent={() => {}}
              />
            ) : null
          )}
        </div>
      </div>
      <div class="text-presets-editor__separator"></div>
      <PresetList fonts={state.fonts} />
    </div>
  )
}
export default TextPresetsEditor
