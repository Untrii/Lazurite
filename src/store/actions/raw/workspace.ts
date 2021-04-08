import Slide from '@/models/presentation/Slide'
import SlideObject from '@/models/presentation/slideObjects/base/SlideObject'
import { raw as store } from '@/store'
import { getObjectsByArea, getObjectsByCoords, getSelectedObjects } from '@/store/getters/raw/workspace'
import { getCurrentSlide } from '@/store/getters/raw/workspace'
import { saveCurrentPresentation } from '../util'

const listeners = new Map<Slide, Set<Function>>()
function triggerListeners(slide: Slide) {
  for (const [key, value] of listeners) {
    if (key === slide) {
      value.forEach((callback) => callback())
    }
  }
}

export function onPointerClick(x: number, y: number, ctrlPressed = false) {
  const objects = getObjectsByCoords(x, y)
  if (!ctrlPressed) deselectAll()
  if (objects.length > 0) select(objects[0], ctrlPressed)
  triggerListeners(getCurrentSlide())
}

export function onAreaSelect(top: number, left: number, right: number, bottom: number, ctrlPressed = false) {
  const objects = getObjectsByArea(top, left, right, bottom)
  if (!ctrlPressed) deselectAll()
  for (const object of objects) {
    select(object, true)
  }
  triggerListeners(getCurrentSlide())
}

export function select(object: SlideObject, append = false) {
  if (append) store.currentTab.selection.addItem(object)
  else store.currentTab.selection.setSelection(object)
  triggerListeners(getCurrentSlide())
}

export function deselectAll() {
  store.currentTab.selection.clear()
  triggerListeners(getCurrentSlide())
}

export function moveSelection(startOffsetLeft: number, startOffsetTop: number, endLeft: number, endTop: number) {
  const relativeCoords = new Map<SlideObject, [number, number]>()
  const selection = store.currentTab.selection
  const selectedObjects = getSelectedObjects()
  for (const object of selectedObjects) {
    relativeCoords.set(object, [object.left - selection.left, object.top - selection.top])
  }
  for (const object of selectedObjects) {
    const [left, top] = relativeCoords.get(object)
    object.left = endLeft - startOffsetLeft + left
    object.top = endTop - startOffsetTop + top
  }
  saveCurrentPresentation()
  triggerListeners(getCurrentSlide())
}

export function hoverObject(object: SlideObject) {
  store.currentTab.hoveredObject = object
  triggerListeners(getCurrentSlide())
}

export function unhoverObject() {
  store.currentTab.hoveredObject = null
  triggerListeners(getCurrentSlide())
}

export function addSlideChangeListener(slide: Slide, callback: () => void) {
  if (!listeners.has(slide)) listeners.set(slide, new Set())
  listeners.get(slide).add(callback)
}

export function removeSlideChangeListener(slide: Slide, callback: () => void) {
  if (!listeners.has(slide)) return
  listeners.get(slide).delete(callback)
  if (listeners.get(slide).size == 0) listeners.delete(slide)
}

export function clearSlideChangeListeners() {
  listeners.clear()
}
