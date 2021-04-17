import Slide from '@/models/presentation/Slide'
import SlideObject from '@/models/presentation/slideObjects/base/SlideObject'
import { raw as store, StoreType } from '@/store'

const listeners = new Map<Slide, Set<Function>>()
function triggerListeners(slide: Slide) {
  for (const [key, value] of listeners) {
    if (key === slide) {
      value.forEach((callback) => callback())
    }
  }
}

export default class WorkspaceActions {
  onPointerClick(this: StoreType, x: number, y: number, ctrlPressed = false) {
    const objects = this.getObjectsByCoords(x, y)
    if (!ctrlPressed) this.deselectAll()
    if (objects.length > 0) this.select(objects[0], ctrlPressed)
    triggerListeners(this.getCurrentSlide())
  }

  onAreaSelect(this: StoreType, top: number, left: number, right: number, bottom: number, ctrlPressed = false) {
    const objects = this.getObjectsByArea(top, left, right, bottom)
    if (!ctrlPressed) this.deselectAll()
    for (const object of objects) {
      this.select(object, true)
    }
    triggerListeners(this.getCurrentSlide())
  }

  select(this: StoreType, object: SlideObject, append = false) {
    if (append) store.currentTab.selection.addItem(object)
    else store.currentTab.selection.setSelection(object)
    triggerListeners(this.getCurrentSlide())
  }

  deselectAll(this: StoreType) {
    store.currentTab.selection.clear()
    triggerListeners(this.getCurrentSlide())
  }

  moveSelection(this: StoreType, startOffsetLeft: number, startOffsetTop: number, endLeft: number, endTop: number) {
    const relativeCoords = new Map<SlideObject, [number, number]>()
    const selection = store.currentTab.selection
    const selectedObjects = this.getSelectedObjects()
    for (const object of selectedObjects) {
      relativeCoords.set(object, [object.left - selection.left, object.top - selection.top])
    }
    for (const object of selectedObjects) {
      const [left, top] = relativeCoords.get(object)
      object.left = endLeft - startOffsetLeft + left
      object.top = endTop - startOffsetTop + top
    }
    this.saveCurrentPresentation()
    triggerListeners(this.getCurrentSlide())
  }

  resizeSelection(this: StoreType, newTop: number, newLeft: number, newBottom: number, newRight: number) {
    const selection = this.currentTab.selection
    if (selection.isEmpty) return
    const { top, left, bottom, right } = selection

    const scaleY = (newBottom - newTop) / (bottom - top)
    const scaleX = (newRight - newLeft) / (right - left)

    for (const object of selection.items) {
      object.width *= scaleX
      object.height *= scaleY
      object.left += newLeft - left + (object.left - left) * (scaleX - 1)
      object.top += newTop - top + (object.top - top) * (scaleY - 1)
    }

    triggerListeners(this.getCurrentSlide())
  }

  deleteSelectedObjects(this: StoreType) {
    if (store.currentTab.selection.isEmpty) return
    const currentSlide = this.getCurrentSlide()
    const selectedObjects = this.getSelectedObjects()
    const filteredObjects = currentSlide.filter((item) => !selectedObjects.includes(item))
    currentSlide.length = filteredObjects.length
    store.currentTab.selection.clear()

    for (let i = 0; i < filteredObjects.length; i++) {
      currentSlide[i] = filteredObjects[i]
    }
    triggerListeners(currentSlide)
  }

  hoverObject(this: StoreType, object: SlideObject) {
    store.currentTab.hoveredObject = object
    triggerListeners(this.getCurrentSlide())
  }

  unhoverObject(this: StoreType) {
    store.currentTab.hoveredObject = null
    triggerListeners(this.getCurrentSlide())
  }

  addSlideChangeListener(this: StoreType, slide: Slide, callback: () => void) {
    if (!listeners.has(slide)) listeners.set(slide, new Set())
    listeners.get(slide).add(callback)
  }

  removeSlideChangeListener(this: StoreType, slide: Slide, callback: () => void) {
    if (!listeners.has(slide)) return
    listeners.get(slide).delete(callback)
    if (listeners.get(slide).size == 0) listeners.delete(slide)
  }

  clearSlideChangeListeners(this: StoreType) {
    listeners.clear()
  }

  onCurrentSlideChange(this: StoreType) {
    triggerListeners(this.getCurrentSlide())
  }
}
