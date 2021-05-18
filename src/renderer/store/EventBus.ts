import IEventBusMap from './IEventBusMap'

export default class EventBus {
  private _listeners = new Map<string, Set<[any[], Function]>>()

  triggerEvent<T extends keyof IEventBusMap>(name: T, ...args: IEventBusMap[T]) {
    const listeners = this._listeners.get(name)
    if (!listeners) return
    for (const [listenerArgs, listener] of listeners) {
      let isSame = true
      for (let i = 0; i < listenerArgs.length; i++) {
        if (listenerArgs[i] !== args[i]) {
          isSame = false
          break
        }
      }
      if (isSame) listener()
    }
  }

  addEventListener<T extends keyof IEventBusMap>(name: T, callback: Function, ...args: IEventBusMap[T]) {
    if (!this._listeners.has(name)) this._listeners.set(name, new Set())
    this._listeners.get(name).add([args, callback])
  }

  removeEventListener<T extends keyof IEventBusMap>(name: T, callback: Function) {
    const listeners = this._listeners.get(name)
    if (!listeners) return
    for (const listener of listeners) {
      if (listener[1] === callback) listeners.delete(listener)
    }
  }

  clearEventListeners<T extends keyof IEventBusMap>(name: T, ...args: IEventBusMap[T]) {
    const listeners = this._listeners.get(name)
    if (!listeners) return
    for (const entry of listeners) {
      const [listenerArgs] = entry
      let isSame = true
      for (let i = 0; i < listenerArgs.length; i++) {
        if (listenerArgs[i] !== args[i]) {
          isSame = false
          break
        }
      }
      if (isSame) listeners.delete(entry)
    }
  }
}
