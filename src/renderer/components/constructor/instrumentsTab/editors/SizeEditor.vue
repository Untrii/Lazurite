<template>
  <div>
    <b-input-group
      v-for="form in forms"
      size="sm"
      :key="form.propertyName"
      :prepend="form.displayName"
    >
      <b-form-input
        :value="element[form.propertyName]"
        @input="onInput(form.propertyName, $event)"
        type="number"
      ></b-form-input>
    </b-input-group>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import EditorService from '@/services/EditorService'

let service = new EditorService()

@Component
export default class SizeEditor extends Vue {
  element: any = {}

  forms = [
    {
      displayName: 'X',
      propertyName: 'left',
    },
    {
      displayName: 'Y',
      propertyName: 'top',
    },
    {
      displayName: 'W',
      propertyName: 'width',
    },
    {
      displayName: 'H',
      propertyName: 'height',
    },
  ]

  getState() {
    this.element = service.selectedElement
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  onInput(propertyName, newVal) {
    service.changeSelectedObjectProperty(propertyName, newVal)
  }
}
</script>

<style lang="scss" scoped></style>
