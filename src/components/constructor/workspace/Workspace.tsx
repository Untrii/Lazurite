import { h } from 'preact'
import { useEffect, useMemo, useRef } from 'preact/hooks'
import render from '@/slideRenderer'
import store from '@/store'

interface WorkspaceProps {
  width: number
}

const Workspace = (props: WorkspaceProps) => {
  const canvas = useRef(null)

  const currentTab = store.currentTab
  const currentPresentation = currentTab.openedPresentation

  let canvasWidth = props.width - 32
  let canvasHeight = (canvasWidth / 16) * 9

  useEffect(() => {
    let canvasElement = canvas.current
    canvasElement.width = canvasWidth
    canvasElement.height = canvasHeight
    render(canvasElement.getContext('2d'), currentPresentation, currentTab.selectedSlideIndex)
  })

  let canvasStyle = {
    display: 'block',
    marginTop: '16px',
    marginLeft: '16px',
  }
  if (canvasWidth < 0) canvasStyle.display = 'none'
  return (
    <div>
      <canvas ref={canvas} style={canvasStyle}></canvas>
    </div>
  )
}

export default Workspace
