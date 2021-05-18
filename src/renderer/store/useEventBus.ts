import useForceUpdate from 'common/util/hooks/useForceUpdate'
import { useLayoutEffect } from 'preact/hooks'
import { StoreType } from '.'
import IEventBusMap from './IEventBusMap'

export default function useEventBus<T extends keyof IEventBusMap>(
  store: StoreType,
  event: T,
  ...args: IEventBusMap[T]
) {
  const forceUpdate = useForceUpdate()
  useLayoutEffect(() => {
    const listener = () => forceUpdate()
    store.addEventListener(event, listener, ...args)
    return () => store.removeEventListener(event, listener)
  })
}
