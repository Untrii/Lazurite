import store from '@/store'

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
