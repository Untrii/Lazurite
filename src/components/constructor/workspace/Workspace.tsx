import { h } from 'preact'
import { useEffect, useMemo, useRef } from 'preact/hooks'
import render from '@/slideRenderer'
import store from '@/store'
import Slide from '../Slide'

interface IWorkspaceProps {
  width: number
}

const Workspace = (props: IWorkspaceProps) => {
  const currentTab = store.currentTab
  const presentation = currentTab.openedPresentation

  const slideWidth = props.width - 32
  const slideHeight = (slideWidth / 16) * 9

  const rootStyle = {
    marginTop: '16px',
    marginLeft: '16px',
  }
  return (
    <div style={rootStyle}>
      <Slide
        width={slideWidth}
        height={slideHeight}
        index={currentTab.selectedSlideIndex}
        presentation={presentation}
      />
    </div>
  )
}

export default Workspace
