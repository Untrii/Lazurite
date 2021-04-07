import SlideObject from '@/models/presentation/slideObjects/base/SlideObject'
import store from '..'

function isInside(rangeStart: number, rangeEnd: number, x: number) {
  return x >= rangeStart && x <= rangeEnd
}

export function getObjectsByCoords(x: number, y: number) {
  const currentTab = store.currentTab
  const currentSlide = currentTab.currentSlide

  const result: SlideObject[] = []
  for (const object of currentSlide) {
    if (isInside(object.left, object.right, x) && isInside(object.top, object.bottom, y)) result.push(object)
  }
  result.sort((a, b) => b.zIndex - a.zIndex)
  return result
}

export function getObjectsByArea(top: number, left: number, right: number, bottom: number) {
  const currentTab = store.currentTab
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

export function getCurrentPresentation() {
  return store.currentTab.openedPresentation
}

export function getCurrentSlide() {
  return store.currentTab.currentSlide
}

export function isAnySlideExists() {
  return store.currentTab.openedPresentation.slides.length > 0
}

export function nextZIndex() {
  const slide = getCurrentSlide()
  if (slide.length > 0) return Math.max(...slide.map((item) => item.zIndex)) + 1
  return 0
}

export function getCurrentTool() {
  return store.currentTab.tool
}

export function getSelectedObjects() {
  return store.currentTab.selection.items
}
