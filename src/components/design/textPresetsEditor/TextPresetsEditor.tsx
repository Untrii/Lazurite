import './TextPresetsEditor.scss'

import { h } from 'preact'
import { useState } from 'preact/hooks'

import store from '@/store'
import * as design from '@/store/actions/design'
import io from '@/io'
import { requireResourceAsync } from '@/dataLoader'
import Font from '@/models/common/Font'

import PresetList from './PresetList'
import FontList from './FontList'

async function preloadFontPreviews() {
  const startTime = Date.now()
  const fonts = await io.getFonts()
  await Promise.all(fonts.map((font) => requireResourceAsync(font.previewSource, '', 'svg')))
  console.info(`Loaded font preview in ${Date.now() - startTime}ms`)
}

preloadFontPreviews()

const TextPresetsEditor = () => {
  const [fonts, setFonts] = useState([] as Font[])
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(
    store.currentTab.openedPresentation.theme.fontPresets.length > 0 ? 0 : -1
  )

  if (fonts.length == 0)
    io.getFonts().then((result) => {
      setFonts(result)
    })

  const onFontSelect = function (index: number, forAll = false) {
    if (forAll) {
      design.selectPresetFont(fonts[index])
    } else {
      if (selectedPresetIndex != -1) design.selectPresetFont(fonts[index], selectedPresetIndex)
    }
  }

  return (
    <div class="text-presets-editor">
      <FontList
        fonts={fonts}
        onSelect={(index) => onFontSelect(index)}
        onSelectForAll={(index) => onFontSelect(index, true)}
      />
      <div class="text-presets-editor__separator"></div>
      <PresetList fonts={fonts} onPresetSelect={setSelectedPresetIndex} selectedIndex={selectedPresetIndex} />
    </div>
  )
}
export default TextPresetsEditor
