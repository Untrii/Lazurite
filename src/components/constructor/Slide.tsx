//import './Slide.scss'
import Presentation from '@/models/presentation/Presentation'
import render from '@/slideRenderer'
import { h } from 'preact'
import { useLayoutEffect, useRef } from 'preact/hooks'
import SlideModel from '@/models/presentation/Slide'
import { useReactiveLayoutEffect } from '@/util/reactivity'
import ObjectSelection from '@/models/editor/ObjectSelection'
import useForceUpdate from '@/util/useForceUpdate'

interface ISlideProps {
  width: number
  height: number
  presentation: Presentation
  slide: SlideModel
  selection?: ObjectSelection
}

const Slide = (props: ISlideProps) => {
  const canvas = useRef(null)
  const forceUpdate = useForceUpdate()

  let canvasWidth = props.width
  let canvasHeight = props.height

  useReactiveLayoutEffect(() => {
    let canvasElement = canvas.current
    canvasElement.width = canvasWidth
    canvasElement.height = canvasHeight
    render(
      canvasElement.getContext('2d'),
      props.presentation,
      props.slide,
      () => {
        requestAnimationFrame(forceUpdate)
      },
      props.selection
    )
  })

  let canvasStyle = {
    display: 'block',
  }
  if (canvasWidth < 0) canvasStyle.display = 'none'
  return <canvas ref={canvas} style={canvasStyle}></canvas>
}
export default Slide
