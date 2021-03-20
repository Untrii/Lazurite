import { JSX } from 'preact'
import { useState } from 'preact/hooks'

export default function useDelayedUnmount(component: JSX.Element, isShown: boolean, delay = 500) {
  const [isRendering, setIsRendering] = useState(isShown)

  if (isShown) setIsRendering(true)
  else {
    setTimeout(() => {
      setIsRendering(false)
    }, delay)
  }

  if (isRendering) return component
  else return null
}
