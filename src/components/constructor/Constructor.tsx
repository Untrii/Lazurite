import './Constructor.scss'
import { h } from 'preact'
import PreviewPanel from './previewPanel/PreviewPanel'
import Workspace from './workspace/Workspace'

const Constructor = () => {
  return (
    <div class="constructor">
      <PreviewPanel />
      <Workspace />
    </div>
  )
}
export default Constructor
