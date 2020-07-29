<template>
  <div v-if="isOneElementSelected">
    <div v-for="(value, name) in element" :key="name">{{ name }}</div>
  </div>
  <div v-else>
    Please select one element.
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import EditorService from '@/services/EditorService'

let service = new EditorService()

@Component
export default class EditTab extends Vue {
  isOneElementSelected: boolean = false
  element: any

  getState() {
    //this.element = service.
    this.isOneElementSelected = service.isOneElementSelected
    this.element = service.selectedElement
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  getEditorType(propertyName) {
    switch (propertyName) {
    }
  }
}
</script>

<style lang="scss" scoped></style>
