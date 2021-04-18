import { useState } from 'preact/hooks'

export default function useForceUpdate() {
  const [, updateFn] = useState({})

  return () => {
    updateFn({})
  }
}
