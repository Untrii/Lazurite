import './PreviewPanel.scss'

import { h } from 'preact'

import assets from '@/assets'
import store, { raw as rawStore } from '@/store'

import DropdownButton from '@/components/controls/DropdownButton'
import Slide from 'common/components/Slide'

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

  const onCLick = function (index: number) {
    store.selectSlide(index)
  }

  const selectedIndex = store.currentTab.selectedSlideIndex

  return (
    <div className="preview-panel">
      {presentation.slides.map((slide, index) => (
        <div class="preview-panel__slide-wrap">
          {selectedIndex == index ? <div class="preview-panel__selection-mark"></div> : null}
          <div
            class="preview-panel__slide"
            onMouseEnter={(event) => (event.target as any).classList.add('preview-panel__slide_animated')}
            onClick={() => onCLick(index)}
          >
            <div class="preview-panel__slide-delete" onClick={onSlideDelete(index)}>
              <img src={assets.delete} alt="" />
            </div>
            <Slide width={slideWidth} height={slideHeight} slide={slide} presentation={presentation} isPreview={true} />
          </div>
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
