import './AnimatedDialogBox.scss'

import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { useReactiveState } from '@/util/reactivity'

interface IAnimatedDialogBoxProps {
  isHiding: boolean
  width: number
  height: number
  children: any
}

function joinSet(set: Set<any>) {
  return Array.from(set).join(' ')
}

const AnimatedDialogBox = ({ isHiding, width, height, children }: IAnimatedDialogBoxProps) => {
  const state = useReactiveState({
    rootClasses: new Set(['animated-dialog-box']),
    rootStyles: {},
  })

  if (isHiding) {
    state.rootClasses.delete('animated-dialog-box_visible')
    state.rootClasses.add('animated-dialog-box_hidden')
    state.rootStyles = {
      width: '1px',
      height: '1px',
    }
  }

  useEffect(() => {
    if (!isHiding) {
      state.rootClasses.add('animated-dialog-box_visible')
      state.rootClasses.delete('animated-dialog-box_hidden')
      state.rootStyles = {
        width: width + 'px',
        height: height + 'px',
      }
    }
  })

  return (
    <div class={joinSet(state.rootClasses)} style={state.rootStyles}>
      {children}
    </div>
  )
}
export default AnimatedDialogBox
