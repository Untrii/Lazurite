export default class ReactiveRepository {
  private onChangeListeners: { source: string; callback: Function }[]

  constructor() {
    this.onChangeListeners = []
  }

  public onChange(debug?: boolean) {
    for (let callback of this.onChangeListeners) {
      if (!debug) {
        callback.callback()
      } else {
        let start = window.performance.now()
        callback.callback()
        let end = window.performance.now()
        let time = Math.round((end - start) * 1000)
        console.log(`Callback of ${callback.source} took ${time}mcs`)
      }
    }
  }
  addOnChangeListener(callback: Function, callbackSource: string) {
    this.onChangeListeners.push({ callback, source: callbackSource })
  }
}
