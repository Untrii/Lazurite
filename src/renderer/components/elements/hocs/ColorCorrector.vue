<template>
  <div class="media-wrap" :style="style">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import VisualisationService from '@/services/VisualisationService'

let service = new VisualisationService()
let defaultProps = {
  blur: 0,
  brightness: 1,
  contrast: 1,
  grayscale: 0,
  hueRotate: 0,
  opacity: 1,
  saturate: 1,
  sepia: 0,
  dropShadow: 0,
}

@Component({ name: 'ColorCorrector' })
export default class ColorCorrector extends Vue {
  @Prop() blur!: string | number
  @Prop() brightness!: string | number
  @Prop() contrast!: string | number
  @Prop() grayscale!: string | number
  @Prop() hueRotate!: string | number
  @Prop() opacity!: string | number
  @Prop() saturate!: string | number
  @Prop() sepia!: string | number
  @Prop() dropShadow!: string | number

  getState() {}

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  get style() {
    let filters = {
      blur: `blur(${this.blur}px)`,
      brightness: `brightness(${this.brightness})`,
      contrast: `contrast(${this.contrast})`,
      grayscale: `grayscale(${this.grayscale})`,
      dropShadow: `drop-shadow(0px 10px ${this.dropShadow}px black)`,
      hueRotate: `hue-rotate(${this.hueRotate}deg)`,
      opacity: `opacity(${this.opacity})`,
      saturate: `saturate(${this.saturate})`,
      sepia: `sepia(${this.sepia})`,
    }

    let result = ''

    for (const prop in defaultProps) {
      if (this.$props[prop] != defaultProps[prop]) result += filters[prop] + ' '
    }
    return {
      filter: result,
    }
  }
}
</script>

<style lang="scss" scoped>
.media-wrap {
  width: 100%;
  height: 100%;
  user-select: none;
}
</style>
