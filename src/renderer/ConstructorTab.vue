<template>
  <div>
    <div class="root" :style="tabStyle">
      <preview></preview>
      <workspace></workspace>
      <instruments
        @demonstration-started="demonstrationOpened = true"
      ></instruments>
    </div>
    <demonstration
      v-if="demonstrationOpened"
      @closed="demonstrationOpened = false"
    ></demonstration>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Preview from './components/constructor/Preview.vue'
import Workspace from './components/constructor/Workspace.vue'
import Instruments from './components/constructor/Instruments.vue'
import ConstructorService from './services/ConstructorService'
import Demonstration from './components/constructor/Demonstration.vue'

let service = new ConstructorService()

@Component({
  components: {
    Preview,
    Workspace,
    Instruments,
    Demonstration,
  },
})
export default class ConstructorTab extends Vue {
  previewSize = 0
  instrumentsSize = 0
  timelineSize = 0
  demonstrationOpened = false

  getState() {
    this.previewSize = service.previewModuleSize ?? 0
    this.instrumentsSize = service.instrumentsModuleSize ?? 0
    this.timelineSize = service.timelineModuleSize ?? 0
  }

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    service.addOnChangeListener(this.onChangeListener)
    service.bindDefaultConstructorHotkeys()
  }
  beforeDestroy() {
    service.removeOnChangeListener(this.onChangeListener)
    service.unbindDefaultConstructorHotkeys()
  }

  get tabStyle() {
    return {
      gridTemplateColumns:
        this.previewSize + 'px 1fr ' + this.instrumentsSize + 'px',
    }
  }
}
</script>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  display: inline-grid;
}
</style>
