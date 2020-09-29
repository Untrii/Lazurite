<template>
  <div>
    <lz-group-caption>
      Grid
    </lz-group-caption>
    <div class="settings-block">
      <lz-switch :checked="isGridEnabled" @change="onGridEnabledChange($event)" size="small"> Enable grid</lz-switch>
    </div>
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

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    service.addOnChangeListener(this.onChangeListener)
  }
  beforeDestroy() {
    service.removeOnChangeListener(this.onChangeListener)
  }

  onGridEnabledChange(newVal: boolean) {
    service.changeGridState(newVal)
  }
}
</script>

<style lang="scss" scoped>
.settings-block {
  margin-left: 20px;
  margin-right: 8px;
}
</style>
