<template>
  <div>
    <b-form-group>
      <b-form-checkbox :checked="isGridEnabled" @change="onGridEnabledChange($event)">
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
export default class SlideSettingsTab extends Vue {
  isGridEnabled = false

  getState() {
    this.isGridEnabled = service.isGridEnabled
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  onGridEnabledChange(newVal: boolean) {
    service.changeGridState(newVal)
  }
}
</script>

<style lang="scss" scoped></style>
