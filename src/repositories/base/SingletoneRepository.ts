import magicWords from '@/utils/magicWords'
export default class SingletoneRepository {
  private static get singletonesObject() {
    const win: any = window
    if (!win[magicWords.singletoneSource]) win[magicWords.singletoneSource] = {}
    return win[magicWords.singletoneSource]
  }

  protected static setInstance(instance: SingletoneRepository) {
    const singletones = this.singletonesObject
    singletones[this.prototype.constructor.name] = instance
  }

  protected static getInstanse(initFunction?: Function) {
    const singletones = this.singletonesObject

    if (!singletones[this.prototype.constructor.name]) {
      if (initFunction) {
        initFunction()
      } //else return {}
      else
        return new Proxy(
          {},
          {
            get: (target, prop) => {
              if (singletones[this.prototype.constructor.name])
                return singletones[this.prototype.constructor.name][prop]
              else return undefined
            }
          }
        )
    }
    return singletones[this.prototype.constructor.name]
  }
}
