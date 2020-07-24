export default class ElementPreset {
  public image: string
  public name: string
  public prameters: Map<string, any>
  public type: string

  constructor(
    image: string,
    name: string,
    type: string,
    parameters: object | Map<string, any>
  ) {
    this.image = image
    this.name = name
    this.type = type

    this.prameters = new Map()
    for (const key in parameters) {
      if (parameters instanceof Map)
        this.prameters.set(key, parameters.get(key))
      else this.prameters.set(key, parameters[key])
    }
  }
}
