import AppStateModel from 'common/models/store/AppStateModel'

export default class Store extends AppStateModel {
  use<Extendor extends object, This extends Store>(this: This, extendor: Extendor) {
    const prototype = Object.getPrototypeOf(extendor)
    const descriptors = {
      ...Object.getOwnPropertyDescriptors(prototype),
      ...Object.getOwnPropertyDescriptors(extendor),
    }

    for (const key in descriptors) {
      if (this[key] !== undefined) continue

      const descriptor = descriptors[key]
      if (typeof descriptor.value !== 'undefined') {
        this[key] = descriptor.value
      }

      if (descriptor.get) {
        Object.defineProperty(this, key, {
          get: descriptor.get.bind(this),
        })
      }
      if (descriptor.set) {
        Object.defineProperty(this, key, {
          set: descriptor.set.bind(this),
        })
      }
    }

    return this as This & Extendor
  }
}
