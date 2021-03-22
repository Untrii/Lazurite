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

  const getFontVariants = function (font: Font) {
    const result = new Set<string>()
    for (const variant of font.variants) {
      result.add(variant.type)
    }
    return Array.from(result)
  }

  const getFontWeights = function (font: Font) {
    const result = new Set<number>()
    for (const variant of font.variants) {
      result.add(variant.weight)
    }
    return Array.from(result)
  }

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
                variants={getFontVariants(font)}
                weights={getFontWeights(font)}
                onSelectForAll={() => {}}
                onSelectForCurrent={() => {}}
              />
            ) : null
          )}
        </div>
      </div>
      <div class="text-presets-editor__separator"></div>
      <div class="text-presets-editor__preset-list"></div>
    </div>
  )
}
export default TextPresetsEditor
