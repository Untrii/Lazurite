export abstract class Tool<EventMap extends object> {
  private _waiters = new Map<keyof EventMap, ((value: any) => void)[]>()
  private _listeners = new Map<keyof EventMap, Set<(value: any) => void>>()

  triggerEvent<T extends keyof EventMap>(name: T, payload: EventMap[T]) {
    const callbackList = this._waiters.get(name)
    if (callbackList) {
      callbackList.forEach((item) => item(payload))
      this._waiters.delete(name)
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
}

interface IPointerToolEventMap {
  click: { x: number; y: number }
  ctrlClick: { x: number; y: number }
  areaSelect: { startX: number; startY: number; endX: number; endY: number }
}
export class PointerTool extends Tool<IPointerToolEventMap> {}

interface IAreaDrawerToolEventMap {
  areaSelect: { startX: number; startY: number; endX: number; endY: number }
}
export class AreaDrawerTool extends Tool<IAreaDrawerToolEventMap> {}

export type AnyTool = PointerTool | AreaDrawerTool
