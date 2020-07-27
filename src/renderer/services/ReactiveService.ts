import { Instance } from '@/repositories/CommonRepository'
export default class ReactiveService {
  private onChangeListeners: Function[]

  constructor() {
    this.onChangeListeners = []
    Instance.addOnChangeListener(() => this.onChange())
  }

  protected onChange() {
    for (let callback of this.onChangeListeners) {
      callback()
    }
  }
  addOnChangeListener(callback: Function) {
    if (callback == undefined) throw new Error('callback is undefined')
    this.onChangeListeners.push(callback)
  }
}
