import io from '@/io'
import Slide from '@/models/presentation/Slide'
import SlideObject from '@/models/presentation/slideObjects/base/SlideObject'
import { StoreType } from '@/store'
import randomString from '@/util/randomString'

function roughlyEquals(num0: number, num1: number) {
  return Math.abs(num0 - num1) < 0.5
}

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
    if (append) this.currentTab.selection.addItem(object)
    else this.currentTab.selection.setSelection(object)
    this.onCurrentSlideChange()
  }

  deselectAll(this: StoreType) {
    this.currentTab.selection.clear()
    this.onCurrentSlideChange()
  }

  stickSide(
    this: StoreType,
    start: number,
    end: number,
    sides: ['left' | 'top', 'right' | 'bottom'],
    stickSides?: number[]
  ): [number, number[]] {
    const stickDistance = 8
    const currentSlide = this.getCurrentSlide()
    const selection = this.currentTab.selection

    let delta = 0
    let lines = [] as number[]
    let closest = Number.POSITIVE_INFINITY
    let closestObject = null as SlideObject

    if (!Array.isArray(stickSides)) stickSides = [start, end, (start + end) / 2]

    const handleDeltas = function (deltas: number[], sticks: number[], object?: SlideObject) {
      deltas.forEach((d, index) => {
        const ad = Math.abs(d)
        if (ad < closest && ad <= stickDistance) {
          closest = ad
          delta = d
          closestObject = object
          lines = [sticks[index]]
        }
      })
    }

    for (const object of currentSlide) {
      if (selection.isInSelection(object)) continue
      const objectStart = object[sides[0]]
      const objectEnd = object[sides[1]]
      const deltas = []
      const sticks = []
      ;[objectStart, objectEnd, (objectStart + objectEnd) / 2].forEach((side0) => {
        stickSides.forEach((side1) => {
          deltas.push(side0 - side1)
          sticks.push(side0)
        })
      })

      deltas.forEach((d, index) => {
        const ad = Math.abs(d)
        if (ad < closest && ad <= stickDistance) {
          closest = ad
          delta = d
          closestObject = object
          lines = [sticks[index]]
        }
      })
    }

    {
      const resolution = this.getCurrentPresentation().resolution
      const start = 0
      const end = sides[0] == 'left' ? resolution.width : resolution.height
      const middle = end / 2
      const deltas = []
      const sticks = []

      ;[start, end, middle].forEach((side0) =>
        stickSides.forEach((side1) => {
          deltas.push(side0 - side1)
          sticks.push(side0)
        })
      )

      handleDeltas(deltas, sticks)
    }

    if (
      stickSides.length == 2 &&
      roughlyEquals(start + delta, closestObject?.[sides[0]] as number) &&
      roughlyEquals(end + delta, closestObject?.[sides[1]] as number)
    )
      lines = [start + delta, end + delta]
    return [delta, lines]
  }

  stickSelection(
    this: StoreType,
    left: number,
    top: number,
    right?: number,
    bottom?: number,
    sides?: string[]
  ): [number, number, number[], number[]] {
    const selection = this.currentTab.selection
    const selectionWidth = selection.width
    const selectionHeight = selection.height

    if (typeof right != 'number') right = left + selectionWidth
    if (typeof bottom != 'number') bottom = top + selectionHeight
    if (!Array.isArray(sides)) sides = ['left', 'top', 'right', 'bottom']

    let xSides
    let ySides

    const withNor = function (w, nor) {
      return sides.includes(w) && !sides.includes(nor)
    }

    if (withNor('left', 'right')) xSides = [left]
    if (withNor('right', 'left')) xSides = [right]
    if (withNor('top', 'bottom')) ySides = [top]
    if (withNor('bottom', 'top')) ySides = [bottom]

    let [deltaX, linesX] = this.stickSide(left, right, ['left', 'right'], xSides)
    let [deltaY, linesY] = this.stickSide(top, bottom, ['top', 'bottom'], ySides)

    return [deltaX, deltaY, linesX, linesY]
  }

  moveSelection(this: StoreType, endLeft: number, endTop: number) {
    const relativeCoords = new Map<SlideObject, [number, number]>()
    const selection = this.currentTab.selection
    const selectedObjects = this.getSelectedObjects()
    for (const object of selectedObjects) {
      relativeCoords.set(object, [object.left - selection.left, object.top - selection.top])
    }
    for (const object of selectedObjects) {
      const [left, top] = relativeCoords.get(object)
      object.left = endLeft + left
      object.top = endTop + top
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
    this.saveCurrentPresentation()
  }

  deleteSelectedObjects(this: StoreType) {
    if (this.currentTab.selection.isEmpty) return
    const currentSlide = this.getCurrentSlide()
    const selectedObjects = this.getSelectedObjects()
    const filteredObjects = currentSlide.filter((item) => !selectedObjects.includes(item))
    currentSlide.length = filteredObjects.length
    this.currentTab.selection.clear()

    for (let i = 0; i < filteredObjects.length; i++) {
      currentSlide[i] = filteredObjects[i]
    }
    this.currentTab.hoveredObject = null
    this.onCurrentSlideChange()
    this.saveCurrentPresentation()
  }

  hoverObject(this: StoreType, object: SlideObject) {
    if (this.currentTab.hoveredObject === object) return
    this.currentTab.hoveredObject = object
    this.onCurrentSlideChange()
  }

  unhoverObject(this: StoreType) {
    if (this.currentTab.hoveredObject === null) return
    this.currentTab.hoveredObject = null
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
