//import './Slide.scss'
import Presentation from '@/models/presentation/Presentation'
import render from '@/slideRenderer'
import { h } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

interface ISlideProps {
  width: number
  height: number
  presentation: Presentation
  index: number
}

const Slide = (props: ISlideProps) => {
  const canvas = useRef(null)

  let canvasWidth = props.width
  let canvasHeight = props.height

  useEffect(() => {
    let canvasElement = canvas.current
    canvasElement.width = canvasWidth
    canvasElement.height = canvasHeight
    render(canvasElement.getContext('2d'), props.presentation, props.index)
  })

  let canvasStyle = {
    display: 'block',
  }
  if (canvasWidth < 0) canvasStyle.display = 'none'
  return <canvas ref={canvas} style={canvasStyle}></canvas>
}
export default Slide
