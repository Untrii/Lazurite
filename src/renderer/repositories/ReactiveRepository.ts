export default class ReactiveRepository {
  private onChangeListeners: Function[]

  constructor() {
    this.onChangeListeners = []
  }

  protected onChange() {
    for (let callback of this.onChangeListeners) {
      callback()
    }
  }
  addOnChangeListener(callback: Function) {
    this.onChangeListeners.push(callback)
  }
}
