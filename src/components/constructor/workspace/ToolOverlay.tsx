import './ToolOverlay.scss'
import { getCurrentPresentation, getCurrentTool } from '@/store/getters/slide'
import { h, JSX } from 'preact'
import { useReactiveState } from '@/util/reactivity'
import { AreaDrawerTool, PointerTool } from '@/models/editor/Tool'
import RendererResolution from '@/models/slideRenderer/RendererResolution'

interface IToolOverlayProps {
  width: number
  height: number
  children: JSX.Element
}

function minmax(a, b) {
  if (a > b) return [b, a]
  else return [a, b]
}

const ToolOverlay = ({ width, height, children }: IToolOverlayProps) => {
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
    currentWidth: width,
    currentHeight: height,
  })

  if (state.currentWidth != width) state.currentWidth = width
  if (state.currentHeight != height) state.currentHeight = height

  const currentTool = getCurrentTool()

  const onMouseDown = function (mouseDownEvent: MouseEvent) {
    const currentTool = getCurrentTool()

    const onMouseMove = function (mouseMoveEvent: MouseEvent) {
      const deltaX = mouseMoveEvent.clientX - mouseDownEvent.clientX
      const deltaY = mouseMoveEvent.clientY - mouseDownEvent.clientY

      state.areaEnd = {
        x: state.areaStart.x + deltaX,
        y: state.areaStart.y + deltaY,
      }
    }

    const onMouseUp = function (mouseUpEvent: MouseEvent) {
      const { width: presentationWidth, height: presentationHeight } = getCurrentPresentation().resolution
      const resolution = new RendererResolution(presentationWidth, presentationHeight)
      resolution.targetWidth = state.currentWidth

      const scaledStartX = mouseDownEvent.offsetX / resolution.scale
      const scaledStartY = mouseDownEvent.offsetY / resolution.scale
      const scaledEndX = scaledStartX + (mouseUpEvent.clientX - mouseDownEvent.clientX) / resolution.scale
      const scaledEndY = scaledStartY + (mouseUpEvent.clientY - mouseDownEvent.clientY) / resolution.scale

      const [top, bottom] = minmax(scaledStartY, scaledEndY)
      const [left, right] = minmax(scaledStartX, scaledEndX)

      if (currentTool?.name == 'pointer') {
        const pointerTool = currentTool as PointerTool
        if (bottom - top <= 4 && right - left <= 4)
          pointerTool.triggerEvent('click', { x: scaledEndX, y: scaledEndY, ctrl: mouseDownEvent.ctrlKey })
        else {
          pointerTool.triggerEvent('areaSelect', { left, top, right, bottom, ctrl: mouseDownEvent.ctrlKey })
        }
      } else if (currentTool?.name == 'areaDrawer') {
        const areaDrawerTool = currentTool as AreaDrawerTool
        areaDrawerTool.triggerEvent('areaSelect', { left, top, right, bottom })
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

  const [left, right] = minmax(state.areaStart.x, state.areaEnd.x)
  const [top, bottom] = minmax(state.areaStart.y, state.areaEnd.y)
  const areaWidth = right - left
  const areaHeight = bottom - top
  const isAreaShown =
    (currentTool?.name == 'areaDrawer' && areaWidth > 0 && areaHeight > 0) ||
    (currentTool?.name == 'pointer' && areaWidth >= 4 && areaHeight >= 4)
  const areaStyle = {
    top: top - height + 'px',
    left: left + 'px',
    width: areaWidth + 'px',
    height: areaHeight + 'px',
  }

  const rootStyle = {
    width: width + 'px',
    height: height + 'px',
  }

  const rootClasses = ['tool-overlay']
  if (currentTool?.name == 'areaDrawer') {
    rootClasses.push('tool-overlay__crosshair')
  }

  return (
    <div class={rootClasses.join(' ')} style={rootStyle} onMouseDown={onMouseDown}>
      {children}
      {isAreaShown ? <div class="tool-overlay__area" style={areaStyle}></div> : null}
    </div>
  )
}
export default ToolOverlay
