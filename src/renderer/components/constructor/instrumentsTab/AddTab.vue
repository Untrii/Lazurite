<template>
  <div>
    <div v-for="(value, name) in elements" :key="name">
      {{ name }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ConstructorService from '@/services/ConstructorService'
import elements from '@/elements/index'

let service = new ConstructorService()
@Component
export default class AddTab extends Vue {
  getState() {}

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  get elements() {
    return elements
  }
}
</script>

<style lang="scss" scoped></style>
