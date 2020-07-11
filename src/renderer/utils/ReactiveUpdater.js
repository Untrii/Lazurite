import _Vue from 'vue'

export default class Vue extends _Vue {
  updateState(service) {
    for (let field in service) {
      this[field] = service[field]
    }
  }
}
