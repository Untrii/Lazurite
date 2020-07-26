<template>
  <div class="workspace" v-if="selectedSlideIndex >= 0" :style="rootStyle">
    <slide
      :index="selectedSlideIndex"
      :width="workspaceWidth"
      :height="workspaceHeight"
      :isRedactable="true"
    ></slide>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ConstructorService from '@/services/ConstructorService'
import Slide from './Slide.vue'

let service = new ConstructorService()

@Component({
  components: {
    Slide,
  },
})
export default class Workspace extends Vue {
  selectedSlideIndex = -1
  workspaceWidth = 1

  get workspaceHeight() {
    return (this.workspaceWidth / 16) * 9
  }

  getState() {
    this.selectedSlideIndex = service.selectedSlideIndex ?? -1
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  mounted() {
    window.addEventListener('resize', this.recalcWidth)
    this.recalcWidth()
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.recalcWidth)
  }

  recalcWidth() {
    console.log('recalc')
    let result = 1
    if (
      !(
        service.timelineModuleSize &&
        service.previewModuleSize &&
        service.instrumentsModuleSize
      )
    )
      return

    result =
      window.innerWidth -
      service.previewModuleSize -
      service.instrumentsModuleSize -
      40
    if (
      window.innerHeight <
      (result / 16) * 9 + 75 + service.timelineModuleSize
    )
      result = ((window.innerHeight - service.timelineModuleSize - 75) / 9) * 16
    this.workspaceWidth = result
  }

  get rootStyle() {
    return {
      width: this.workspaceWidth + 'px',
    }
  }
}
</script>

<style lang="scss" scoped>
.workspace {
  margin: 20px auto 0;
}
</style>
