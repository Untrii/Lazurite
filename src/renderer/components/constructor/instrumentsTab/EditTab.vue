<template>
  <div v-if="isOneElementSelected"></div>
  <div v-else>
    Please select one element.
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ConstructorService from '@/services/ConstructorService'

let service = new ConstructorService()

@Component
export default class EditTab extends Vue {
  selectedElementsCount = 0

  getState() {
    this.selectedElementsCount = service.selectedObjectIds.length
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  get isOneElementSelected() {
    return this.selectedElementsCount == 1
  }
}
</script>

<style lang="scss" scoped></style>
