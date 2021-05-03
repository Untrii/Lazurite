//import './Slide.scss'
import Presentation from '@/models/presentation/Presentation'
import render, { addSlideRenderEventListener, removeSlideRenderEventListener } from '@/slideRenderer'
import { h } from 'preact'
import { useLayoutEffect, useRef, useState } from 'preact/hooks'
import SlideModel from '@/models/presentation/Slide'
import { raw as store } from '@/store'

interface ISlideProps {
  width: number
  height: number
  presentation: Presentation
  slide: SlideModel
  isPreview?: boolean
  onRendered?: (ctx: CanvasRenderingContext2D) => void
}

const renderingCanvases = new Set<HTMLCanvasElement>()
const frameRequests = new Set<HTMLCanvasElement>()

const Slide = (props: ISlideProps) => {
  const canvas = useRef(null)
  const { width, height, presentation, slide, onRendered } = props

  const renderCanvas = function (onRerenderRequest = () => {}) {
    const canvasElement = canvas.current as HTMLCanvasElement
    const context = canvasElement?.getContext('2d')
    if (context) {
      render(context, presentation, slide, onRerenderRequest)
      onRendered?.(context)
    }
  }

  useLayoutEffect(() => {
    let canvasElement = canvas.current as HTMLCanvasElement
    canvasElement.width = width
    canvasElement.height = height

    if (props.isPreview) {
      const context = canvasElement.getContext('2d')
      const listener = (slide) => context.drawImage(slide, 0, 0, width, height)

      const onRerenderRequest = () => setTimeout(() => renderCanvas(onRerenderRequest), 200)
      renderCanvas(onRerenderRequest)

      addSlideRenderEventListener(props.slide, listener)
      return () => removeSlideRenderEventListener(props.slide, listener)
    }
    renderingCanvases.add(canvasElement)

    const onRerenderRequest = () => {
      if (!renderingCanvases.has(canvasElement)) return
      if (frameRequests.has(canvasElement)) return
      frameRequests.add(canvasElement)
      requestAnimationFrame(() => {
        frameRequests.delete(canvasElement)
        renderCanvas(onRerenderRequest)
      })
    }

    store.addEventListener('slideChange', onRerenderRequest, slide)
    renderCanvas(onRerenderRequest)
    return () => {
      renderingCanvases.delete(canvasElement)
      store.removeEventListener('slideChange', onRerenderRequest)
    }
  })

  let canvasStyle = {
    display: 'block',
  }
  if (width < 0) canvasStyle.display = 'none'
  return <canvas ref={canvas} style={canvasStyle}></canvas>
}
export default Slide
