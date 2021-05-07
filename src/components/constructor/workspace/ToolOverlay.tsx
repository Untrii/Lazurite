import './ToolOverlay.scss'
import { h, JSX } from 'preact'
import { useReactiveState } from '@/util/reactivity'
import { AreaDrawerTool, PointerTool } from '@/models/editor/Tool'
import RendererResolution from '@/models/slideRenderer/RendererResolution'
import store from '@/store'
import useForceUpdate from '@/util/hooks/useForceUpdate'

interface IToolOverlayProps {
  width: number
  height: number
  onAreaSelect?: () => void
  children: JSX.Element
}

function minmax(a: number, b: number) {
  if (a > b) return [b, a]
  else return [a, b]
}

const ToolOverlay = ({ width, height, onAreaSelect, children }: IToolOverlayProps) => {
  const state = useReactiveState({
    areaStart: {
      x: -1,
      y: -1,
    },
    areaEnd: {
      x: -1,
      y: -1,
    },
    isSelecting: false,
    showBox: false,
    currentWidth: width,
    currentHeight: height,
  })

  if (state.currentWidth != width) state.currentWidth = width
  if (state.currentHeight != height) state.currentHeight = height

  const currentTool = store.getCurrentTool()

  const onMouseDown = function (mouseDownEvent: MouseEvent) {
    mouseDownEvent.preventDefault()
    let isDragging = false
    const currentTool = store.getCurrentTool()

    const { width: presentationWidth, height: presentationHeight } = store.getCurrentPresentation().resolution
    const resolution = new RendererResolution(presentationWidth, presentationHeight)
    resolution.targetWidth = state.currentWidth

    const scaledStartX = mouseDownEvent.offsetX / resolution.scale
    const scaledStartY = mouseDownEvent.offsetY / resolution.scale

    const selection = store.currentTab.selection
    const isInSelection = !!store.getObjectsByCoords(scaledStartX, scaledStartY).find((o) => selection.isInSelection(o))
    const startSelectionX = selection.left
    const startSelectionY = selection.top

    if (currentTool instanceof PointerTool) currentTool.triggerEvent('mouseDown', {})

    const getDeltas = function (event0: MouseEvent, event1: MouseEvent) {
      return [event1.clientX - event0.clientX, event1.clientY - event0.clientY]
    }

    const onMouseMove = function (mouseMoveEvent: MouseEvent) {
      mouseMoveEvent.preventDefault()
      const [deltaX, deltaY] = getDeltas(mouseDownEvent, mouseMoveEvent)
      const [scaledDeltaX, scaledDeltaY] = [deltaX, deltaY].map((d) => d / resolution.scale)

      const scaledEndX = scaledStartX + scaledDeltaX
      const scaledEndY = scaledStartY + scaledDeltaY

      const [top, bottom] = minmax(scaledStartY, scaledEndY)
      const [left, right] = minmax(scaledStartX, scaledEndX)

      if (bottom - top > 4 || right - left > 4) isDragging = true

      if (currentTool instanceof PointerTool) {
        if (isDragging) {
          if (isInSelection) {
            currentTool.triggerEvent('selectionMove', {
              startOffsetLeft: scaledStartX - startSelectionX,
              startOffsetTop: scaledStartY - startSelectionY,
              left: scaledEndX,
              top: scaledEndY,
            })
            if (state.showBox) state.showBox = false
          } else {
            currentTool.triggerEvent('areaSelect', { left, top, right, bottom, ctrl: mouseDownEvent.ctrlKey })
            if (!state.showBox) state.showBox = true
          }
        }
      } else if (currentTool?.name == 'areaDrawer') {
        if (isDragging) {
          if (!state.showBox) state.showBox = true
        }
      }

      state.areaEnd = {
        x: state.areaStart.x + deltaX,
        y: state.areaStart.y + deltaY,
      }
    }

    const onMouseUp = function (mouseUpEvent: MouseEvent) {
      mouseUpEvent.preventDefault()
      const [scaledDeltaX, scaledDeltaY] = getDeltas(mouseDownEvent, mouseUpEvent).map((d) => d / resolution.scale)

      const scaledEndX = scaledStartX + scaledDeltaX
      const scaledEndY = scaledStartY + scaledDeltaY

      const [top, bottom] = minmax(scaledStartY, scaledEndY)
      const [left, right] = minmax(scaledStartX, scaledEndX)

      if (currentTool?.name == 'pointer') {
        const pointerTool = currentTool as PointerTool
        if (!isDragging)
          pointerTool.triggerEvent('click', { x: scaledEndX, y: scaledEndY, ctrl: mouseDownEvent.ctrlKey })
        else if (!isInSelection) {
          pointerTool.triggerEvent('areaSelect', { left, top, right, bottom, ctrl: mouseDownEvent.ctrlKey })
          onAreaSelect?.()
        }
        pointerTool.triggerEvent('mouseUp', {})
      } else if (currentTool?.name == 'areaDrawer') {
        const areaDrawerTool = currentTool as AreaDrawerTool
        areaDrawerTool.triggerEvent('areaSelect', { left, top, right, bottom })
        onAreaSelect?.()
      }

      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)

      state.areaStart = {
        x: -1,
        y: -1,
      }
      state.areaEnd = {
        x: -1,
        y: -1,
      }
    }

    state.areaStart = {
      x: mouseDownEvent.offsetX,
      y: mouseDownEvent.offsetY,
    }
    state.areaEnd = {
      x: mouseDownEvent.offsetX,
      y: mouseDownEvent.offsetY,
    }
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)
  }

  const rootStyle = {
    width: width + 'px',
    height: height + 'px',
  }

  const rootClasses = ['tool-overlay']
  if (currentTool?.name == 'areaDrawer') {
    rootClasses.push('tool-overlay__crosshair')
  }

  const onMouseMove = function (event: MouseEvent) {
    if (currentTool?.name == 'areaDrawer') return
    const { width: presentationWidth, height: presentationHeight } = store.getCurrentPresentation().resolution
    const resolution = new RendererResolution(presentationWidth, presentationHeight)
    resolution.targetWidth = state.currentWidth

    const objects = store.getObjectsByCoords(event.offsetX / resolution.scale, event.offsetY / resolution.scale)
    if (objects.length > 0) store.hoverObject(objects[0])
    else store.unhoverObject()
  }

  const onMouseLeave = () => store.unhoverObject()

  return (
    <div
      class={rootClasses.join(' ')}
      style={rootStyle}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}
export default ToolOverlay
