import ReactiveRepository from '@/repositories/base/ReactiveRepository'

export default class ReactiveService {
  private onChangeListeners!: Set<Function>

  constructor(className: string, dependsOn: ReactiveRepository[]) {
    let win: any = window
    if (!win.__serviceSingletones) win.__serviceSingletones = {}
    let __serviceSingletones: any = win.__serviceSingletones
    if (!__serviceSingletones[className]) {
      __serviceSingletones[className] = this
      this.onChangeListeners = new Set()
      for (const item of dependsOn) {
        item.addOnChangeListener(() => this.onChange(), className)
      }
    }
    return __serviceSingletones[className]
  }

  protected onChange() {
    for (let callback of this.onChangeListeners) {
      callback()
    }
  }
  addOnChangeListener(callback: Function) {
    if (callback == undefined) throw new Error('callback is undefined')
    this.onChangeListeners.add(callback)
  }
  removeOnChangeListener(callback: Function) {
    if (callback == undefined) throw new Error('callback is undefined')
    this.onChangeListeners.delete(callback)
  }
}
