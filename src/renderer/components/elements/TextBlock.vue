<template>
  <div class="text-block" :style="blockStyle" v-html="content"></div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Color from '@/entities/Color'

@Component
export default class TextBlock extends Vue {
  @Prop() fontFamily!: string
  @Prop() fontSize!: number
  @Prop() fontWeight!: number
  @Prop() content!: string
  @Prop({ default: () => new Color(false) }) color!: Color
  @Prop({ default: () => new Color(true) }) backgroundColor!: Color

  @Prop() id!: string
  @Prop() scale!: number

  get blockStyle() {
    let color = new Color()
    color.fromOther(this.color)
    let backgroundColor = new Color()
    backgroundColor.fromOther(this.backgroundColor)
    return {
      fontFamily: "'" + this.fontFamily + "'",
      fontSize: this.fontSize * this.scale + 'px',
      fontWeight: this.fontWeight,
      color: color.toCssColor(),
      backgroundColor: backgroundColor.toCssColor(),
    }
  }
}
</script>

<style lang="css" scoped>
.text-block {
  outline: none;
  width: 100%;
  height: 100%;
  word-wrap: none;
  word-break: break-word;
}
.text-block:active,
.text-block:hover,
.text-block:focus {
  outline: 0;
  outline-offset: 0;
}
</style>
