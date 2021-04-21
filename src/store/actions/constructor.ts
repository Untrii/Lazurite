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

  selectSlide(this: StoreType, index: number) {
    if (this.currentTab.selectedSlideIndex == index) return

    this.currentTab.selectedSlideIndex = index
    this.currentTab.selection.clear()
    this.currentTab.hoveredObject = null
    this.onCurrentSlideChange()
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
    this.onCurrentSlideChange()
    await this.saveCurrentPresentation()
  }

  async changeSelectedObjectProperty<T extends SlideObject>(this: StoreType, propertyName: keyof T, value: T[keyof T]) {
    const objects = this.getSelectedObjects()
    if (objects.length != 1) return
    const object = objects[0]

    if (typeof object?.[propertyName as string] == 'undefined') return
    ;(object as T)[propertyName] = value
    store.onCurrentSlideChange()
    await this.saveCurrentPresentation()
  }
}
