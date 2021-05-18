import './DropdownSelector.scss'

import { h, Ref } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

interface IDropdownSelectorProps {
  variants: string[]
  colorName: string
  visible: boolean
  onClick: (index: number) => void
  onClose: () => void
}

const DropdownSelector = ({ variants, colorName, visible, onClick, onClose }: IDropdownSelectorProps) => {
  const selectorClasses = ['dropdown-selector']
  const itemClasses = ['dropdown-selector__item', 'control-bg_' + colorName]
  const rootClasses = ['scrollbox']

  if (visible) rootClasses.push('scrollbox_visible')
  else rootClasses.push('scrollbox_hidden')

  const contentHeight = variants.length * 24
  const blockHeight = Math.min(contentHeight, 120)

  const isScrollVisible = contentHeight > 120
  const [isScrollbarPressed, setScrollbarPressed] = useState(false)
  const [scrollbarPosition, setScrollbarPosition] = useState(0)
  const scrollContent: Ref<null | HTMLDivElement> = useRef(null)

  const maxScrollbarPosition = 72

  const onScrollbarPressed = function (event: MouseEvent) {
    setScrollbarPressed(true)

    let initialPos = event.clientY - scrollbarPosition

    const mouseMoveListener = (event: MouseEvent) => {
      const offset = event.clientY - initialPos
      setScrollbarPosition(Math.max(Math.min(offset, maxScrollbarPosition), 0))

      scrollContent.current.scrollTop = ((contentHeight - 120) * offset) / maxScrollbarPosition
    }

    const mouseUplistener = (event: MouseEvent) => {
      setScrollbarPressed(false)
      document.removeEventListener('mouseup', mouseUplistener)
      document.removeEventListener('mousemove', mouseMoveListener)
      event.stopPropagation()
    }

    document.addEventListener('mouseup', mouseUplistener)
    document.addEventListener('mousemove', mouseMoveListener)
  }

  const onScroll = function () {
    setScrollbarPosition((scrollContent.current.scrollTop / (contentHeight - 120)) * maxScrollbarPosition)
  }

  useEffect(() => {
    const listener = (event) => {
      if (!isScrollbarPressed) {
        onClose()
        document.removeEventListener('click', listener)
      }
    }
    document.addEventListener('click', listener)

    return () => document.removeEventListener('click', listener)
  })

  return (
    <div style="height:1px">
      <div class={rootClasses.join(' ')} onClick={(event) => event.stopPropagation()}>
        <div class={selectorClasses.join(' ')} ref={scrollContent} onScroll={onScroll}>
          {variants.map((item, index) => (
            <p class={itemClasses.join(' ')} onClick={() => onClick(index)}>
              {item}
            </p>
          ))}
        </div>
        {isScrollVisible ? (
          <div class="scrollbox__scrollbar">
            <div
              class="scrollbox__scrollbar-box"
              onMouseDown={onScrollbarPressed}
              style={{ marginTop: scrollbarPosition + 'px' }}
            >
              <div class="scrollbox__scrollbar-view"></div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default DropdownSelector
