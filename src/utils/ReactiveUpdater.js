import _Vue from 'vue'

export default class Vue extends _Vue {
  updateState(service) {
    for (const field in service) {
      this[field] = service[field]
    }
  }
}
