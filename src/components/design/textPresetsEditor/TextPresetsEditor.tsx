import './TextPresetsEditor.scss'
import { h } from 'preact'
import io from '@/io'
import { requireResourceAsync } from '@/dataLoader'
import { useReactiveState } from '@/util/reactivity'
import Font from '@/models/common/Font'
import FontCard from './FontCard'
import SearchBox from '@/components/controls/SearchBox'

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
  })

  if (state.fonts.length == 0)
    io.getFonts().then((result) => {
      state.fonts = result
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

  return (
    <div class="text-presets-editor">
      <div class="text-presets-editor__font-list">
        <div class="text-presets-editor__font-list-searchbox">
          <SearchBox />
        </div>
        <div class="text-presets-editor__font-list-items">
          {state.fonts.map((font) => (
            <FontCard
              key={font.name}
              preview={font.previewSource}
              variants={getFontVariants(font)}
              weights={getFontWeights(font)}
              onSelectForAll={() => {}}
              onSelectForCurrent={() => {}}
            />
          ))}
        </div>
      </div>
      <div class="text-presets-editor__separator"></div>
      <div class="text-presets-editor__preset-list"></div>
    </div>
  )
}
export default TextPresetsEditor
