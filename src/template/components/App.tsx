import './App.scss'
import Slide from './Slide'
import RendererResolution from 'common/models/slideRenderer/RendererResolution'
import { h, Fragment } from 'preact'
import JSONSerializer from 'common/serialization/JsonSerializer'
import Presentation from 'common/models/presentation/Presentation'
import { useEffect, useState } from 'preact/hooks'
import useHotkey from 'common/util/hooks/useHotkey'

const presentationJSON = document.querySelector<HTMLDivElement>('*[data-res-main]')?.innerText ?? ''
const presentation = JSONSerializer.fromJSON<Presentation>(presentationJSON)

const App = () => {
  if (!presentation) return <div class="app">Compiler error</div>

  const [windowWidth, updateWindowWidth] = useState(window.innerWidth)
  const [windowHeight, updateWindowHeight] = useState(window.innerHeight)

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const slideForward = function () {
    if (currentSlideIndex + 1 < presentation.slides.length) setCurrentSlideIndex(currentSlideIndex + 1)
  }

  const slideBackward = function () {
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
    <div class="app">
      <Slide
        width={resolution.targetWidth}
        height={resolution.targetHeight}
        presentation={presentation}
        slide={presentation.slides[currentSlideIndex]}
      ></Slide>
    </div>
  )
}
export default App
