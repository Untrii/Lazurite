import './Constructor.scss'
import { h } from 'preact'
import PreviewPanel from './previewPanel/PreviewPanel'
import Workspace from './workspace/Workspace'
import { useEffect, useState } from 'preact/hooks'
import InstrumentsPanel from './instrimentsPanel/InstrumentsPanel'

const Constructor = () => {
  let [windowWidth, updateWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    let handler = () => updateWindowWidth(window.innerWidth)

    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  })

  return (
    <div class="constructor">
      <PreviewPanel />
      <Workspace width={windowWidth - 440} />
      <InstrumentsPanel />
    </div>
  )
}
export default Constructor
