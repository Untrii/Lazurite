<template>
  <div class="slide" :style="rootStyle">
    <base-element
      v-for="id in elementIds"
      :key="id"
      :id="id"
      :scale="width / 1920"
    ></base-element>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BaseElement from './BaseElement.vue'
import VisualisationService from '@/services/VisualisationService'
import Theme, { getBlankTheme, BackgroundType } from '@/entities/Theme'

let service = new VisualisationService()

@Component({
  components: {
    BaseElement,
  },
})
export default class Slide extends Vue {
  elementIds: string[] = []
  theme: Theme = getBlankTheme()
  @Prop(Number) index
  @Prop(Number) width
  @Prop(Number) height

  getState() {
    this.elementIds = Array.from(service.slideByIndex(this.index).keys())
    this.theme = { ...service.theme }
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  get rootStyle() {
    // let scaleX = this.height / 1080
    // let scaleY = this.width / 1920
    let theme = this.theme

    let val = theme.backgroundValue
    let type = theme.backgroundType
    if (type == BackgroundType.Image) val = val.replace('/preview', '')

    let bgStyle = {}

    switch (type) {
      case BackgroundType.Color:
        bgStyle = {
          background: val,
        }
        break
      case BackgroundType.Gradient:
        bgStyle = {
          backgroundImage: 'linear-gradient(' + val + ')',
        }
        break
      case BackgroundType.Gradicolor:
        throw new Error('Gradicolor doesnt implemented')
        break
      case BackgroundType.Pattern:
        bgStyle = {
          backgroundImage: 'url("' + val + '")',
        }
        break
      case BackgroundType.Image:
        bgStyle = {
          backgroundImage: 'url("' + val + '")',
          backgroundSize: 'cover',
        }
        break
    }

    return {
      height: this.height + 'px',
      width: this.width + 'px',
      ...bgStyle,
    }
  }
}
</script>

<style>
.slide {
  position: relative;
}
</style>
