import io from '@/io'
import Slide from '@/models/presentation/Slide'
import SlideObject from '@/models/presentation/slideObjects/base/SlideObject'
import { raw as store, StoreType } from '@/store'
import randomString from '@/util/randomString'

export default class WorkspaceActions {
  onPointerClick(this: StoreType, x: number, y: number, ctrlPressed = false) {
    const objects = this.getObjectsByCoords(x, y)
    if (!ctrlPressed) this.deselectAll()
    if (objects.length > 0) this.select(objects[0], ctrlPressed)
    this.onCurrentSlideChange()
  }

  onAreaSelect(this: StoreType, top: number, left: number, right: number, bottom: number, ctrlPressed = false) {
    const objects = this.getObjectsByArea(top, left, right, bottom)
    if (!ctrlPressed) this.deselectAll()
    for (const object of objects) {
      this.select(object, true)
    }
    this.onCurrentSlideChange()
  }

  select(this: StoreType, object: SlideObject, append = false) {
    if (append) store.currentTab.selection.addItem(object)
    else store.currentTab.selection.setSelection(object)
    this.onCurrentSlideChange()
  }

  deselectAll(this: StoreType) {
    store.currentTab.selection.clear()
    this.onCurrentSlideChange()
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
    this.onCurrentSlideChange()
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

    this.onCurrentSlideChange()
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
    this.currentTab.hoveredObject = null
    this.onCurrentSlideChange()
    store.saveCurrentPresentation()
  }

  hoverObject(this: StoreType, object: SlideObject) {
    if (store.currentTab.hoveredObject === object) return
    store.currentTab.hoveredObject = object
    this.onCurrentSlideChange()
  }

  unhoverObject(this: StoreType) {
    if (store.currentTab.hoveredObject === null) return
    store.currentTab.hoveredObject = null
    this.onCurrentSlideChange()
  }

  async addImageInProject(this: StoreType, image: Blob) {
    const ext = image.type.split('/').pop()
    const name = `/resources/${randomString(8)}.${ext}`
    return await io.addFile(image, 'proj', name)
  }

  onCurrentSlideChange(this: StoreType) {
    this.triggerEvent('slideChange', this.getCurrentSlide())
  }
}
