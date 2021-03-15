import './ColorEditor.scss'
import { h } from 'preact'
import HorizontalNav from '../controls/HorizontalNav'
import { useState } from 'preact/hooks'
import PaletteGroup from './PaletteGroup'

const ColorEditor = () => {
  const [currenTab, changeTab] = useState(0)
  const tabs = ['Color', 'Gradient', 'Gradicolor', 'Pattern', 'Image']

  return (
    <div class="color-editor">
      <div class="color-editor__palette">
        <nav class="color-editor__nav">
          <HorizontalNav prepend="Background:" items={tabs} onChange={changeTab} selectedItemIndex={currenTab} />
        </nav>
        <div class="color-editor__palettes">
          <PaletteGroup
            title="My tiles"
            tiles={Array(50)
              .fill(0)
              .map((item) => {
                return { type: 'color', displayValue: '#abcabc' }
              })}
          />
        </div>
      </div>
      <div class="color-editor__separator"></div>
      <div class="color-editor__picked"></div>
    </div>
  )
}
export default ColorEditor
