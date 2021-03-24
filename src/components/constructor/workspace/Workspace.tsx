import { h } from 'preact'

import store from '@/store'

import Slide from '../Slide'

interface IWorkspaceProps {
  width: number
}

const Workspace = (props: IWorkspaceProps) => {
  const currentTab = store.currentTab
  const presentation = currentTab.openedPresentation
  const slide = presentation.slides[currentTab.selectedSlideIndex]

  const slideWidth = props.width - 32
  const slideHeight = (slideWidth / 16) * 9

  const rootStyle = {
    marginTop: '16px',
    marginLeft: '16px',
    width: slideWidth + 'px',
  }
  return (
    <div style={rootStyle}>
      <Slide width={slideWidth} height={slideHeight} slide={slide} presentation={presentation} />
    </div>
  )
}

export default Workspace
