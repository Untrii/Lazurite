<template>
  <div class="text-block" :style="blockStyle" v-html="content"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import VisualisationService from '@/services/VisualisationService'
import Color from '@/entities/Color'

let service = new VisualisationService()

@Component
export default class TextBlock extends Vue {
  fontFamily = ''
  fontSize = 0
  fontWeight = 400
  content = ''
  color = new Color(false)
  backgroundColor = new Color(true)

  @Prop(String) id
  @Prop(Number) scale

  getState() {
    let obj: any = service.elementById(this.id)

    if (obj.fontFamily) this.fontFamily = obj.fontFamily
    if (obj.fontSize) this.fontSize = obj.fontSize
    if (obj.fontWeight) this.fontWeight = obj.fontWeight
    if (obj.content) this.content = obj.content
    if (obj.color) this.color = obj.color
    if (obj.backgroundColor) this.backgroundColor = obj.backgroundColor
  }

  get blockStyle() {
    return {
      fontFamily: "'" + this.fontFamily + "'",
      fontSize: this.fontSize * this.scale + 'px',
      fontWeight: this.fontWeight,
      color: this.color.toCssColor(),
      backgroundColor: this.backgroundColor.toCssColor(),
    }
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }
}
</script>

<style lang="css" scoped>
.text-block {
  outline: none;
  width: inherit;
  height: fit-content;
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
