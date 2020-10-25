<template>
  <div class="wrap" :style="wrapStyle">
    <div class="text-block" :style="blockStyle" v-html="content"></div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Prop } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import Color from '@/entities/Color'
import IColor from '@/entities/IColor'

export default class TextBlock extends Vue {
  @Prop() fontFamily!: string
  @Prop() fontSize!: number
  @Prop() fontWeight!: number
  @Prop() content!: string
  @Prop() horizontalAlign!: string
  @Prop() verticalAlign!: string
  @Prop({ default: () => new Color(false) }) color!: IColor
  @Prop({ default: () => new Color(true) }) backgroundColor!: IColor

  @Prop() id!: string
  @Prop() scale!: number

  get blockStyle() {
    const color = new Color()
    color.fromOther(this.color)
    const backgroundColor = new Color()
    backgroundColor.fromOther(this.backgroundColor)

    return {
      fontFamily: "'" + this.fontFamily + "'",
      fontSize: this.fontSize * this.scale + 'px',
      fontWeight: this.fontWeight,
      color: color.toCssColor(),
      backgroundColor: backgroundColor.toCssColor(),
      textAlign: this.horizontalAlign,
    }
  }

  get wrapStyle() {
    let verticalAlign = 'center'
    if (this.verticalAlign == 'top') verticalAlign = 'flex-start'
    if (this.verticalAlign == 'bottom') verticalAlign = 'flex-end'
    return {
      alignItems: verticalAlign,
    }
  }
}
</script>

<style lang="css" scoped>
.wrap {
  display: flex;
  height: 100%;
  width: 100%;
}
.text-block {
  outline: none;
  word-wrap: none;
  height: fit-content;
  width: 100%;
  word-break: break-word;
}
.text-block:active,
.text-block:hover,
.text-block:focus {
  outline: 0;
  outline-offset: 0;
}
</style>
