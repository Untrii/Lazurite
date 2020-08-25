<template>
  <div class="media-wrap" :style="style">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

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
  @Prop() blur!: number
  @Prop() brightness!: number
  @Prop() contrast!: number
  @Prop() grayscale!: number
  @Prop() hueRotate!: number
  @Prop() opacity!: number
  @Prop() saturate!: number
  @Prop() sepia!: number
  @Prop() dropShadow!: number

  @Prop() scale!: number

  get style() {
    let filters = {
      blur: `blur(${this.blur * this.scale}px)`,
      brightness: `brightness(${this.brightness})`,
      contrast: `contrast(${this.contrast})`,
      grayscale: `grayscale(${this.grayscale})`,
      dropShadow: `drop-shadow(0px 0px ${this.dropShadow * this.scale}px black)`,
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
