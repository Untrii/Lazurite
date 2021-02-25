import { h } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import render from '@/slideRenderer'
import store from '@/store'

const Workspace = (props) => {
  const canvas = useRef(null)

  const currentTab = store.currentTab
  const currentPresentation = currentTab.openedPresentation
  const currentSlide = store.currentTab.currentSlide

  useEffect(() => {
    render(
      canvas.current.getContext('2d'),
      currentPresentation,
      currentTab.selectedSlideIndex
    )
  })
  return (
    <div>
      <canvas width="720" height="405" ref={canvas}></canvas>
    </div>
  )
}

export default Workspace
