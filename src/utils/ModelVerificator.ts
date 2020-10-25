export default class ModelVerificator {
  public static verify(object: object, defaultModel: object): boolean {
    for (const key in defaultModel) {
      if (object.hasOwnProperty(key) && typeof object[key] == typeof defaultModel[key]) continue
      else return false
    }
    return true
  }

  public static createVerificator(defaultModel: object): Function {
    return (object: object) => {
      return this.verify(object, defaultModel)
    }
  }
}
