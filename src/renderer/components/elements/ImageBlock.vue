<template>
  <color-corrector v-bind="$attrs">
    <img
      :src="src"
      alt=""
      style="width:100%; height:100%; user-drag: none; position:absolute"
      @click.prevent
    />
  </color-corrector>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import VisualisationService from '@/services/VisualisationService'
import ColorCorrector from './hocs/ColorCorrector.vue'

let service = new VisualisationService()
@Component({
  components: {
    ColorCorrector,
  },
})
export default class ImageBlock extends Vue {
  @Prop() src!: string
  @Prop() width!: number
  @Prop() height!: number

  getState() {}

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }
}
</script>

<style lang="scss" scoped></style>
