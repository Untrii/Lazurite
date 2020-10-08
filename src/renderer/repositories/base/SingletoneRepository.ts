import magicWords from '@/utils/magicWords'
export default class SingletoneRepository {
  private static get singletonesObject() {
    let win: any = window
    if (!win[magicWords.singletoneSource]) win[magicWords.singletoneSource] = {}
    return win[magicWords.singletoneSource]
  }

  protected static setInstance(instance: SingletoneRepository) {
    let singletones = this.singletonesObject
    singletones[this.prototype.constructor.name] = instance
  }

  protected static getInstanse(initFunction?: Function) {
    let singletones = this.singletonesObject

    if (!singletones[this.prototype.constructor.name]) {
      if (initFunction) {
        initFunction()
      } else return {}
    }
    return singletones[this.prototype.constructor.name]
  }
}
