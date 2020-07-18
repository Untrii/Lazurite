import ReactiveService from './ReactiveService'
import ElementPreset from '@/entities/ElementPreset'

export default class ElementService extends ReactiveService {
  private _groups: Map<string, ElementPreset[]> = new Map()

  constructor() {
    super()
  }

  setGroup(name: string, entries: ElementPreset[]) {
    this._groups.set(name, entries)
  }

  getGroups() {
    return new Map(this._groups)
  }
}
