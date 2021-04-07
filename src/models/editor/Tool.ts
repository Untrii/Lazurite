export type ToolName = 'pointer' | 'areaDrawer'

export abstract class Tool<EventMap extends object> {
  private _waiters = new Map<keyof EventMap, ((value: any) => void)[]>()
  private _listeners = new Map<keyof EventMap, Set<(value: any) => void>>()

  triggerEvent<T extends keyof EventMap>(name: T, payload: EventMap[T]) {
    const waitersCallbackList = this._waiters.get(name)
    const listenersCallbackList = this._listeners.get(name)
    if (waitersCallbackList) {
      waitersCallbackList.forEach((item) => item(payload))
      this._waiters.delete(name)
    }
    if (listenersCallbackList) {
      listenersCallbackList.forEach((item) => item(payload))
    }
  }

  waitForEvent<T extends keyof EventMap>(name: T): Promise<EventMap[T]> {
    return new Promise((resolve, reject) => {
      if (!this._waiters.has(name)) this._waiters.set(name, [])

      const callbackList = this._waiters.get(name)
      callbackList.push(resolve)
    })
  }

  addListener<T extends keyof EventMap>(name: T, listener: (value: EventMap[T]) => void) {
    if (!this._listeners.has(name)) this._listeners.set(name, new Set())
    this._listeners.get(name).add(listener)
  }

  deleteListener<T extends keyof EventMap>(name: T, listener: (value: EventMap[T]) => void) {
    if (!this._listeners.has(name)) return
    this._listeners.get(name).delete(listener)
  }

  abstract get name(): ToolName
}

interface IPointerToolEventMap {
  click: { x: number; y: number; ctrl: boolean }
  areaSelect: { left: number; top: number; right: number; bottom: number; ctrl: boolean }
  selectionMove: { startOffsetLeft: number; startOffsetTop: number; left: number; top: number }
}
export class PointerTool extends Tool<IPointerToolEventMap> {
  get name(): ToolName {
    return 'pointer'
  }
}

interface IAreaDrawerToolEventMap {
  areaSelect: { left: number; top: number; right: number; bottom: number }
}
export class AreaDrawerTool extends Tool<IAreaDrawerToolEventMap> {
  get name(): ToolName {
    return 'areaDrawer'
  }
}

export type AnyTool = PointerTool | AreaDrawerTool
