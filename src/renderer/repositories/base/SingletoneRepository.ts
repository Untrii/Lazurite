import magicWords from '@/utils/magicWords'
export default class SingletoneRepository {
  private static get singletonesObject() {
    let win: any = window
    if (!win[magicWords.singletoneSource]) win[magicWords.singletoneSource] = {}
    return win[magicWords.singletoneSource]
  }

  protected static setInstance(instance: SingletoneRepository) {
    let singletones = this.singletonesObject
    singletones[this.constructor.name] = instance
  }

  protected static getInstanse(initFunction?: Function) {
    let singletones = this.singletonesObject

    if (!singletones[this.constructor.name]) {
      if (initFunction) {
        initFunction()
      } else throw new Error(`${this.constructor.name} isn't loaded`)
    }
    return singletones[this.constructor.name]
  }
}
