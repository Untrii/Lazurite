import './PreviewPanel.scss'

import { h } from 'preact'

import assets from '@/assets'
import store, { raw as rawStore } from '@/store'

import DropdownButton from '@/components/controls/DropdownButton'
import Slide from '../Slide'

const PreviewPanel = () => {
  const slideWidth = 166
  const slideHeight = (slideWidth / 16) * 9

  const watchable = store.currentTab.openedPresentation.slides.length
  const presentation = rawStore.currentTab.openedPresentation

  const onSlideDelete = function (index: number) {
    return (event: MouseEvent) => {
      event.stopPropagation()
      store.deleteSlide(index)
    }
  }

  return (
    <div className="preview-panel">
      {presentation.slides.map((slide, index) => (
        <div
          class="preview-panel__slide"
          onMouseEnter={(event) => (event.target as any).classList.add('preview-panel__slide_animated')}
        >
          <div class="preview-panel__slide-delete" onClick={onSlideDelete(index)}>
            <img src={assets.delete} alt="" />
          </div>
          <Slide width={slideWidth} height={slideHeight} slide={slide} presentation={presentation} isPreview={true} />
        </div>
      ))}

      <div class="preview-panel__buttons">
        <DropdownButton
          colorName="blue-500"
          variants={new Array(7).fill(0).map((item, index) => 'Template ' + index)}
          defaultVariant="New slide"
          groupName="Create from template"
          onDefaultClick={() => store.createSlide()}
        />
      </div>
    </div>
  )
}
export default PreviewPanel
