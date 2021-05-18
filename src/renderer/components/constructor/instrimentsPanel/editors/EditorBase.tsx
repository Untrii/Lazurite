import './EditorBase.scss'
import { h } from 'preact'

const EditorBase = ({ children, title = 'Editor' }) => {
  return (
    <div class="editor-base">
      <h3>{title}</h3>
      <div class="editor-base__content">{children}</div>
    </div>
  )
}
export default EditorBase
