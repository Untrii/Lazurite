import store, { StoreType } from '@/store'

export default class ConstructorGetters {
  getCurrentPresentation(this: StoreType) {
    return this.currentTab.openedPresentation
  }

  getCurrentSlide(this: StoreType) {
    return this.currentTab.currentSlide
  }

  isAnySlideExists(this: StoreType) {
    return this.currentTab.openedPresentation.slides.length > 0
  }

  nextZIndex(this: StoreType) {
    const slide = this.getCurrentSlide()
    if (slide.length > 0) return Math.max(...slide.map((item) => item.zIndex)) + 1
    return 0
  }

  getCurrentTool(this: StoreType) {
    return this.currentTab.tool
  }
}
