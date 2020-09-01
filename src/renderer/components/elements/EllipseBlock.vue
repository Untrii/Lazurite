<template>
  <svg :width="width * scale" :height="height * scale">
    <ellipse :cx="halfWidth" :cy="halfHeight" :rx="halfWidth" :ry="halfHeight" :fill="fillColor" />
  </svg>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import IColor from '@/entities/IColor'
import Color from '@/entities/Color'

@Component
export default class EllipseBlock extends Vue {
  @Prop() scale!: number
  @Prop() width!: number
  @Prop() height!: number
  @Prop() color!: IColor
  @Prop() cornerRadius!: number

  get fillColor() {
    console.log('Ellipse')
    let col = new Color()
    col.fromOther(this.color)
    return col.toCssColor()
  }

  get halfWidth() {
    return this.width * this.scale * 0.5
  }

  get halfHeight() {
    return this.height * this.scale * 0.5
  }
}
</script>

<style lang="scss" scoped></style>
