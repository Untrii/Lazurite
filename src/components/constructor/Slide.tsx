//import './Slide.scss'
import Presentation from '@/models/presentation/Presentation'
import render, { addSlideRenderEventListener, removeSlideRenderEventListener } from '@/slideRenderer'
import { h } from 'preact'
import { useLayoutEffect, useRef, useState } from 'preact/hooks'
import SlideModel from '@/models/presentation/Slide'
import ObjectSelection from '@/models/editor/ObjectSelection'
import { raw as store } from '@/store'

interface ISlideProps {
  width: number
  height: number
  presentation: Presentation
  slide: SlideModel
  selection?: ObjectSelection
  showHovered?: boolean
  isPreview?: boolean
  onRendered?: () => void
}

const renderingCanvases = new Set<HTMLCanvasElement>()
const frameRequests = new Set<HTMLCanvasElement>()

const Slide = (props: ISlideProps) => {
  const canvas = useRef(null)
  //const [lastProps, setLastProps] = useState({props})
  //setLastProps({props})

  const { width, height, presentation, slide, selection, showHovered } = props
  console.log('rendering slide')

  const renderCanvas = function (onRerenderRequest = () => {}) {
    let canvasElement = canvas.current as HTMLCanvasElement
    render(
      canvasElement.getContext('2d'),
      presentation,
      slide,
      onRerenderRequest,
      selection,
      showHovered ? store.getHoveredObject() : null
    )
  }

  const [isFirstRender, onRender] = useState(true)

  useLayoutEffect(() => {
    let canvasElement = canvas.current as HTMLCanvasElement
    if (props.isPreview) {
      const context = canvasElement.getContext('2d')
      const listener = (slide) => context.drawImage(slide, 0, 0, width, height)

      if (isFirstRender) {
        console.log('rendering preview')
        const onRerenderRequest = () => setTimeout(() => renderCanvas(onRerenderRequest), 200)
        renderCanvas(onRerenderRequest)
        onRender(false)
      }

      addSlideRenderEventListener(props.slide, listener)
      return () => removeSlideRenderEventListener(props.slide, listener)
    }
    renderingCanvases.add(canvasElement)

    canvasElement.width = width
    canvasElement.height = height

    const onRerenderRequest = () => {
      if (!renderingCanvases.has(canvasElement)) return
      if (frameRequests.has(canvasElement)) return
      frameRequests.add(canvasElement)
      requestAnimationFrame(() => {
        frameRequests.delete(canvasElement)
        renderCanvas(onRerenderRequest)
        props?.onRendered?.()
      })
    }

    store.addSlideChangeListener(slide, onRerenderRequest)
    renderCanvas(onRerenderRequest)
    return () => {
      renderingCanvases.delete(canvasElement)
      store.removeSlideChangeListener(slide, onRerenderRequest)
    }
  })

  let canvasStyle = {
    display: 'block',
  }
  if (width < 0) canvasStyle.display = 'none'
  return <canvas ref={canvas} style={canvasStyle}></canvas>
}
export default Slide
