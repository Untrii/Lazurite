import './TextPresetsEditor.scss'
import { h } from 'preact'

const TextPresetsEditor = () => {
  return (
    <div class="text-presets-editor">
      <div class="text-presets-editor__font-list"></div>
      <div class="text-presets-editor__separator"></div>
      <div class="text-presets-editor__preset-list"></div>
    </div>
  )
}
export default TextPresetsEditor
