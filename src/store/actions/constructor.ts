import { AnyTool } from '@/models/editor/Tool'
import SlideObject from '@/models/presentation/slideObjects/base/SlideObject'
import store, { StoreType } from '@/store'

export default class ConstructorActions {
  async createSlide(this: StoreType) {
    this.currentTab.openedPresentation.slides.push([])
    await this.saveCurrentPresentation()
  }

  async deleteSlide(this: StoreType, index: number) {
    this.clearSlideChangeListeners()
    store.currentTab.selection.clear()

    const slides = store.currentTab.openedPresentation.slides
    if (index >= 0 && index < slides.length) slides.splice(index, 1)
    await this.saveCurrentPresentation()
  }

  setTool(this: StoreType, index: [number, number], tool: AnyTool) {
    this.currentTab.addTabToolIndex = index
    this.currentTab.tool = tool
  }

  async addObjectOnSlide(this: StoreType, object: SlideObject) {
    const slide = this.getCurrentSlide()
    if (slide) {
      slide.push(object)
    }
    await this.saveCurrentPresentation()
  }
}
