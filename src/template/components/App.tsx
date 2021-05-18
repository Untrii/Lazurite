import './App.scss'
import Slide from './Slide'
import RendererResolution from 'common/models/slideRenderer/RendererResolution'
import { h, Fragment } from 'preact'
import presentationJSON from './presentationJSON.json'
import JSONSerializer from 'common/serialization/JsonSerializer'
import Presentation from 'common/models/presentation/Presentation'
import { useEffect, useState } from 'preact/hooks'
import assets from '../assets'
import useHotkey from 'common/util/hooks/useHotkey'

const presentation = JSONSerializer.fromObject(presentationJSON) as Presentation

const App = () => {
  const [windowWidth, updateWindowWidth] = useState(window.innerWidth)
  const [windowHeight, updateWindowHeight] = useState(window.innerHeight)

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const slideForward = function () {
    console.log('changing slide')
    if (currentSlideIndex + 1 < presentation.slides.length) setCurrentSlideIndex(currentSlideIndex + 1)
  }

  const slideBackward = function () {
    console.log('changing slide')
    if (currentSlideIndex > 0) setCurrentSlideIndex(currentSlideIndex - 1)
  }

  useHotkey('ArrowLeft', slideBackward)
  useHotkey('ArrowRight', slideForward)

  const resolution = new RendererResolution(presentation.resolution.width, presentation.resolution.height)
  resolution.targetWidth = windowWidth
  if (resolution.targetHeight > windowHeight) resolution.targetHeight = windowHeight

  useEffect(() => {
    const listener = function () {
      updateWindowWidth(window.innerWidth)
      updateWindowHeight(window.innerHeight)
    }
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  })

  return (
    <>
      <div style="position: fixed;  transform: scale(0)" data-res-col>
        <img src={assets.error} alt="error" data-placeholder-img />
      </div>
      <div class="app">
        <Slide
          width={resolution.targetWidth}
          height={resolution.targetHeight}
          presentation={presentation}
          slide={presentation.slides[currentSlideIndex]}
        ></Slide>
      </div>
    </>
  )
}
export default App
