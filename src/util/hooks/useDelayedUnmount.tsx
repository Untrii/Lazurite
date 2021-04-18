import { JSX } from 'preact'
import { useReactiveState } from '../reactivity'

export default function useDelayedUnmount(component: JSX.Element, isShown: boolean, delay = 500) {
  const state = useReactiveState({
    isRendering: isShown,
    lastState: isShown,
  })
  state.lastState = isShown
  console.log('hook')

  if (isShown) state.isRendering = true
  else {
    setTimeout(() => {
      if (!state.lastState) state.isRendering = false
    }, delay)
  }

  if (state.isRendering) return component
  else return null
}
