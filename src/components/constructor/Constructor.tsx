import './Constructor.scss'

import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import PreviewPanel from './previewPanel/PreviewPanel'
import Workspace from './workspace/Workspace'
import InstrumentsPanel from './instrimentsPanel/InstrumentsPanel'
import useHotkey from '@/util/useHotkey'
import store from '@/store'

const Constructor = () => {
  let [windowWidth, updateWindowWidth] = useState(window.innerWidth)

  const toolGroups = store.getToolGroups()
  useHotkey('ctrl+P', () => {
    store.setTool([0, 0], toolGroups[0].items[0].tool)
  })
  for (let i = 0; i < toolGroups[1].items.length; i++) {
    const tool = toolGroups[1].items[i].tool
    useHotkey('ctrl+T+' + (i + 1), () => {
      store.setTool([1, i], tool)
    })
  }

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
