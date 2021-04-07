import { AnyTool } from '@/models/editor/Tool'
import SlideObject from '@/models/presentation/slideObjects/base/SlideObject'
import store from '@/store'
import { getCurrentSlide, getObjectsByArea, getObjectsByCoords, getSelectedObjects } from '../getters/slide'
import { saveCurrentPresentation } from './util'

export function createSlide() {
  store.currentTab.openedPresentation.slides.push([])
  saveCurrentPresentation()
}

export function deleteSlide(index: number) {
  const slides = store.currentTab.openedPresentation.slides
  if (index >= 0 && index < slides.length) slides.splice(index, 1)
  saveCurrentPresentation()
}

export function setTool(index: [number, number], tool: AnyTool) {
  store.currentTab.addTabToolIndex = index
  store.currentTab.tool = tool
}

export function onPointerClick(x: number, y: number, ctrlPressed = false) {
  const objects = getObjectsByCoords(x, y)
  if (!ctrlPressed) deselectAll()
  if (objects.length > 0) select(objects[0], ctrlPressed)
}

export function onAreaSelect(top: number, left: number, right: number, bottom: number, ctrlPressed = false) {
  const objects = getObjectsByArea(top, left, right, bottom)
  if (!ctrlPressed) deselectAll()
  for (const object of objects) {
    select(object, true)
  }
}

export function select(object: SlideObject, append = false) {
  if (append) store.currentTab.selection.addItem(object)
  else store.currentTab.selection.setSelection(object)
}

export function deselectAll() {
  store.currentTab.selection.clear()
}

export function addObjectOnSlide(object: SlideObject) {
  const slide = getCurrentSlide()
  if (slide) {
    slide.push(object)
  }
  saveCurrentPresentation()
}

export function moveSelection(startOffsetLeft: number, startOffsetTop: number, endLeft: number, endTop: number) {
  const relativeCoords = new Map<SlideObject, [number, number]>()
  const selection = store.currentTab.selection
  for (const object of getSelectedObjects()) {
    relativeCoords.set(object, [object.left - selection.left, object.top - selection.top])
  }
  for (const object of getSelectedObjects()) {
    const [left, top] = relativeCoords.get(object)
    object.left = endLeft - startOffsetLeft + left
    object.top = endTop - startOffsetTop + top
  }
  saveCurrentPresentation()
}
