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
import { Prop } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import IColor from '@/entities/IColor'
import Color from '@/entities/Color'

export default class extends Vue {
  @Prop() scale!: number
  @Prop() width!: number
  @Prop() height!: number
  @Prop() color!: IColor
  @Prop() cornerRadius!: number

  get fillColor() {
    const col = new Color()
    col.fromOther(this.color)
    return col.toCssColor()
  }
}
</script>

<style lang="scss" scoped></style>
