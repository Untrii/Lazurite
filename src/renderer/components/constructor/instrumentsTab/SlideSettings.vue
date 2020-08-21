<template>
  <div>
    <b-form-group>
      <b-form-checkbox
        v-for="checker in checkers"
        :key="checker.propertyName"
        :checked="element[checker.propertyName]"
        @change="onGridEnabledChange($event)"
      >
        Enable grid
      </b-form-checkbox>
    </b-form-group>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import EditorService from '@/services/EditorService'

let service = new EditorService()

@Component
export default class SlideSettings extends Vue {
  getState() {}

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  onGridEnabledChange(newVal: boolean) {}
}
</script>

<style lang="scss" scoped></style>
