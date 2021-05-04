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

  stickSelection(
    this: StoreType,
    left: number,
    top: number,
    right?: number,
    bottom?: number,
    sides?: string[]
  ): [number, number, number[], number[]] {
    const stickDistance = 8
    const currentSlide = this.getCurrentSlide()
    const selection = this.currentTab.selection
    const selectionWidth = selection.width
    const selectionHeight = selection.height

    if (typeof right != 'number') right = left + selectionWidth
    if (typeof bottom != 'number') bottom = top + selectionHeight
    if (!Array.isArray(sides)) sides = ['left', 'top', 'right', 'bottom']

    let deltaX = 0
    let linesX = []
    let closestX = Number.POSITIVE_INFINITY
    let closestObjectX = null as SlideObject
    let deltaY = 0
    let linesY = []
    let closestY = Number.POSITIVE_INFINITY
    let closestObjectY = null as SlideObject

    for (const object of currentSlide) {
      if (selection.isInSelection(object)) continue
      const deltasX = []
      const sticksX = []
      ;[object.left, object.right, (object.left + object.right) / 2].forEach((side0) => {
        ;[left, right, (left + right) / 2].forEach((side1) => {
          deltasX.push(side0 - side1)
          sticksX.push(side0)
        })
      })
      const deltasY = []
      const sticksY = []
      ;[object.top, object.bottom, (object.top + object.bottom) / 2].forEach((side0) => {
        ;[top, bottom, (top + bottom) / 2].forEach((side1) => {
          deltasY.push(side0 - side1)
          sticksY.push(side0)
        })
      })

      deltasX.forEach((dx, index) => {
        const adx = Math.abs(dx)
        if (index < 2 && !sides.includes('left')) return
        if (index >= 2 && !sides.includes('right')) return
        if (adx < closestX && adx <= stickDistance) {
          closestX = adx
          deltaX = dx
          closestObjectX = object
          linesX = [sticksX[index]]
        }
      })

      deltasY.forEach((dy, index) => {
        const ady = Math.abs(dy)
        if (index < 2 && !sides.includes('top')) return
        if (index >= 2 && !sides.includes('bottom')) return
        if (ady < closestY && ady <= stickDistance) {
          closestY = ady
          deltaY = dy
          closestObjectY = object
          linesY = [sticksY[index]]
        }
      })
    }

    if (
      sides.includes('left') &&
      sides.includes('right') &&
      roughlyEquals(left + deltaX, closestObjectX?.left) &&
      roughlyEquals(right + deltaX, closestObjectX?.right)
    )
      linesX = [left + deltaX, right + deltaX]
    if (
      sides.includes('top') &&
      sides.includes('bottom') &&
      roughlyEquals(top + deltaY, closestObjectY?.top) &&
      roughlyEquals(bottom + deltaY, closestObjectY?.bottom)
    )
      linesY = [top + deltaY, bottom + deltaY]

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
