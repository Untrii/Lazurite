export default class ElementPreset {
  private _parameters: Map<string, any>
  private _generatorFunction!: Function

  public image: string
  public name: string
  public type: string
  public needUserInput: boolean = false

  /**
   *
   * @param image Path to image
   * @param name Preset name
   * @param type Name of creating element
   * @param parameters Object or map with parameters or async function, that will generate it
   */
  constructor(
    image: string,
    name: string,
    type: string,
    parameters: object | Map<string, any> | Function
  ) {
    this.image = image
    this.name = name
    this.type = type
    if (typeof parameters == 'function') {
      this.needUserInput = true
      this._generatorFunction = parameters
    }

    this._parameters = new Map()
    for (const key in parameters) {
      if (parameters instanceof Map)
        this._parameters.set(key, parameters.get(key))
      else this._parameters.set(key, parameters[key])
    }
  }

  async getParameters(): Promise<Map<string, any>> {
    if (!this.needUserInput) return this._parameters
    else {
      let result: Map<string, any> = new Map()
      let generated = this._generatorFunction()
      if (generated instanceof Promise) generated = await generated
      for (const key in generated) {
        result.set(key, generated[key])
      }
      return result
    }
  }
}
