//import './Slide.scss'
import Presentation from '@/models/presentation/Presentation'
import render from '@/slideRenderer'
import { h } from 'preact'
import { useLayoutEffect, useRef, useState } from 'preact/hooks'
import SlideModel from '@/models/presentation/Slide'
import { useReactiveLayoutEffect, useReactiveState } from '@/util/reactivity'
import ObjectSelection from '@/models/editor/ObjectSelection'
import useForceUpdate from '@/util/useForceUpdate'

const animationSchedule = new Map<HTMLCanvasElement, boolean>()

interface ISlideProps {
  width: number
  height: number
  presentation: Presentation
  slide: SlideModel
  selection?: ObjectSelection
}

const Slide = (props: ISlideProps) => {
  const canvas = useRef(null)
  const state = useReactiveState({
    lastProps: props,
  })
  state.lastProps = props

  let canvasWidth = props.width
  let canvasHeight = props.height

  useReactiveLayoutEffect(() => {
    let canvasElement = canvas.current
    canvasElement.width = canvasWidth
    canvasElement.height = canvasHeight

    const onRerenderRequest = () => {
      if (animationSchedule.get(canvasElement)) return
      animationSchedule.set(canvasElement, true)
      requestAnimationFrame(() => {
        animationSchedule.set(canvasElement, false)
        const props = state.lastProps
        render(canvasElement.getContext('2d'), props.presentation, props.slide, onRerenderRequest, props.selection)
      })
    }

    render(canvasElement.getContext('2d'), props.presentation, props.slide, onRerenderRequest, props.selection)
  })

  let canvasStyle = {
    display: 'block',
  }
  if (canvasWidth < 0) canvasStyle.display = 'none'
  return <canvas ref={canvas} style={canvasStyle}></canvas>
}
export default Slide
