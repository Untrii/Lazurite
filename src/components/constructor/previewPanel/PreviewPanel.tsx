import './PreviewPanel.scss'
import { h } from 'preact'
import Slide from '../Slide'
import store from '@/store'

const PreviewPanel = () => {
  const slideWidth = 166
  const slideHeight = (slideWidth / 16) * 9

  const presentation = store.currentTab.openedPresentation

  return (
    <div className="preview-panel">
      {presentation.slides.map((slide, index) => (
        <div class="preview-panel__slide">
          <Slide width={slideWidth} height={slideHeight} index={index} presentation={presentation} />
        </div>
      ))}
    </div>
  )
}
export default PreviewPanel
