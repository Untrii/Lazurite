import './Workspace.scss'

import { h } from 'preact'

import store, { raw as rawStore } from '@/store'

import Slide from 'common/components/Slide'
import ToolOverlay from './ToolOverlay'
import useHotkey from 'common/util/hooks/useHotkey'
import TextEditorOverlay from './TextEditorOverlay'
import ResizeOverlay from './ResizeOverlay'
import ImageDropOverlay from './ImageDropOverlay'
import renderSelection from 'common/slideRenderer/renderSelection'
import RendererResolution from 'common/models/slideRenderer/RendererResolution'
import { PointerTool } from 'common/models/editor/Tool'
import { useEffect, useLayoutEffect, useState } from 'preact/hooks'
import useForceUpdate from 'common/util/hooks/useForceUpdate'
import renderSelectBox from 'common/slideRenderer/renderSelectBox'

interface IWorkspaceProps {
  width: number
}

const Workspace = (props: IWorkspaceProps) => {
  useHotkey('delete', () => {
    store.deleteSelectedObjects()
  })
  useHotkey('ctrl+D', () => {
    store.deselectAll()
  })
  const forceUpdate = useForceUpdate()

  const watchable =
    store.currentTab.openedPresentation.slides.length && store.currentTab.selectedSlideIndex && store.currentTab.tool
  const currentTab = rawStore.currentTab
  const presentation = currentTab.openedPresentation
  const slide = presentation.slides[currentTab.selectedSlideIndex]

  const slideWidth = props.width - 32
  const slideHeight = (slideWidth / 16) * 9

  const rootStyle = {
    marginTop: '16px',
    marginLeft: '16px',
    width: slideWidth + 'px',
  }

  const [guideLines] = useState({ x: [], y: [] } as { x: number[]; y: number[] })
  const [isPointerActive] = useState({ value: false })
  const [selectBox, setSelectBox] = useState({ left: -1, top: -1, right: -1, bottom: -1 })

  const onRendered = function (ctx: CanvasRenderingContext2D) {
    const tool = store.getCurrentTool()
    const resolution = new RendererResolution(presentation.resolution.width, presentation.resolution.height)
    resolution.targetWidth = slideWidth
    const slideObjects = rawStore.getCurrentSlide()
    renderSelection(
      ctx,
      resolution,
      currentTab.selection,
      slideObjects,
      currentTab.hoveredObject,
      isPointerActive.value,
      guideLines
    )
    renderSelectBox(ctx, resolution, selectBox)
  }

  useLayoutEffect(() => {
    const tool = rawStore.getCurrentTool()
    const unstickListener = () => {
      guideLines.x = []
      guideLines.y = []
    }
    const stickListener = (position) => {
      guideLines.x = position.x
      guideLines.y = position.y
    }
    const mouseUpListener = () => {
      if (guideLines?.x?.length > 0 || guideLines?.y?.length > 0) unstickListener()
      isPointerActive.value = false
      setSelectBox({ left: -1, top: -1, right: -1, bottom: -1 })
    }
    const mouseDownListener = () => {
      isPointerActive.value = true
    }
    const areaSelectListener = ({ left = 0, top = 0, right = 0, bottom = 0 }) => {
      selectBox.left = left
      selectBox.top = top
      selectBox.right = right
      selectBox.bottom = bottom
    }

    if (tool instanceof PointerTool) {
      tool.addListener('stick', stickListener)
      tool.addListener('unstick', unstickListener)
      tool.addListener('mouseUp', mouseUpListener)
      tool.addListener('mouseDown', mouseDownListener)
      tool.addListener('areaSelect', areaSelectListener)
      return () => {
        tool.removeListener('stick', stickListener)
        tool.removeListener('unstick', unstickListener)
        tool.removeListener('mouseUp', mouseUpListener)
        tool.removeListener('mouseDown', mouseDownListener)
        tool.removeListener('areaSelect', areaSelectListener)
      }
    }
  })

  return (
    <div style={rootStyle} class="workspace">
      {slide ? (
        <ImageDropOverlay width={slideWidth} height={slideHeight}>
          <ResizeOverlay width={slideWidth} height={slideHeight}>
            <ToolOverlay width={slideWidth} height={slideHeight} onAreaSelect={forceUpdate}>
              <TextEditorOverlay width={slideWidth} height={slideHeight}>
                <Slide
                  width={slideWidth}
                  height={slideHeight}
                  slide={slide}
                  presentation={presentation}
                  onRendered={onRendered}
                />
              </TextEditorOverlay>
            </ToolOverlay>
          </ResizeOverlay>
        </ImageDropOverlay>
      ) : (
        <div class="workspace__placeholder" style={{ height: slideHeight }}>
          There is no slides
        </div>
      )}
    </div>
  )
}

export default Workspace
