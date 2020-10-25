export default class ReactiveRepository {
  private onChangeListeners: { source: string; callback: Function }[]

  constructor() {
    this.onChangeListeners = []
  }

  public onChange(debug?: boolean) {
    for (const callback of this.onChangeListeners) {
      if (!debug) {
        callback.callback()
      } else {
        const start = window.performance.now()
        callback.callback()
        const end = window.performance.now()
        const time = Math.round((end - start) * 1000)
        console.log(`Callback of ${callback.source} took ${time}mcs`)
      }
    }
  }
  addOnChangeListener(callback: Function, callbackSource: string) {
    this.onChangeListeners.push({ callback, source: callbackSource })
  }
}
