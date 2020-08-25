<template>
  <svg :width="width * scale" :height="height * scale">
    <rect
      x="0"
      y="0"
      :rx="cornerRadius * scale"
      :ry="cornerRadius * scale"
      :width="width * scale"
      :height="height * scale"
      :fill="fillColor"
    />
  </svg>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Color from '@/entities/Color'

@Component
export default class extends Vue {
  @Prop() scale!: number
  @Prop() width!: number
  @Prop() height!: number
  @Prop() color!: Color
  @Prop() cornerRadius!: number

  get fillColor() {
    let col = new Color()
    col.fromOther(this.color)
    return col.toCssColor()
  }
}
</script>

<style lang="scss" scoped></style>
