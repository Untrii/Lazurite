import SlideObject from 'common/models/presentation/slideObjects/base/SlideObject'
import { StoreType } from '@/store'

function isInside(rangeStart: number, rangeEnd: number, x: number) {
  return x >= rangeStart && x <= rangeEnd
}

export default class WorkspaceGetters {
  getCurrentSlide(this: StoreType) {
    return this.currentTab.currentSlide
  }

  getHoveredObject(this: StoreType) {
    return this.currentTab.hoveredObject
  }

  getObjectsByCoords(this: StoreType, x: number, y: number) {
    const currentTab = this.currentTab
    const currentSlide = currentTab.currentSlide

    const result: SlideObject[] = []
    for (const object of currentSlide) {
      if (isInside(object.left, object.right, x) && isInside(object.top, object.bottom, y)) result.push(object)
    }
    result.sort((a, b) => b.zIndex - a.zIndex)
    return result
  }

  getObjectsByArea(this: StoreType, top: number, left: number, right: number, bottom: number) {
    const currentTab = this.currentTab
    const currentSlide = currentTab.currentSlide

    const result: SlideObject[] = []
    for (const object of currentSlide) {
      if (
        (isInside(left, right, object.left) ||
          isInside(left, right, object.right) ||
          isInside(object.left, object.right, left) ||
          isInside(object.left, object.right, right)) &&
        (isInside(top, bottom, object.top) ||
          isInside(top, bottom, object.bottom) ||
          isInside(object.top, object.bottom, top) ||
          isInside(object.top, object.bottom, bottom))
      )
        result.push(object)
    }
    result.sort((a, b) => b.zIndex - a.zIndex)
    return result
  }

  getSelectedObjects(this: StoreType) {
    return this.currentTab.selection.items
  }
}
