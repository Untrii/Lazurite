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
import { Vue } from 'vue-class-component'
import ConstrctorStore from '@/services/store/ConstructorStore'
import WindowSettingsService from '@/services/constructor/WindowSettingsService'

const store = new ConstrctorStore()
const service = new WindowSettingsService()

export default class SlideSettingsTab extends Vue {
  get isGridEnabled() {
    return store.isGridEnabled
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
