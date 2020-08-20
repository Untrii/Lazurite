<template>
  <div class="slide" :style="rootStyle" v-if="isRedactable">
    <redactable-base-element
      v-for="id in elementIds"
      :key="id"
      :id="id"
      :scale="width / 1920"
    ></redactable-base-element>
  </div>
  <div class="slide" :style="rootStyle" v-else>
    <base-element v-for="id in elementIds" :key="id" :id="id" :scale="width / 1920"></base-element>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseElement from '@/components/elements/BaseElement.vue'
import RedactableBaseElement from './redactableElements/RedactableBaseElement.vue'
import VisualisationService from '@/services/VisualisationService'
import Theme, { getBlankTheme, BackgroundType } from '@/entities/Theme'

let service = new VisualisationService()

@Component({
  components: {
    BaseElement,
    RedactableBaseElement,
  },
})
export default class Slide extends Vue {
  elementIds: string[] = []
  theme: Theme = getBlankTheme()
  @Prop(Number) index
  @Prop(Number) width
  @Prop(Number) height
  @Prop(Boolean) isRedactable

  @Watch('index')
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
          backgroundImage:
            'url("' +
            process
              .cwd()
              .split('\\')
              .join('/') +
            '/data' +
            val +
            '")',
          backgroundSize: '20%',
        }
        break
      case BackgroundType.Image:
        bgStyle = {
          backgroundImage:
            'url("' +
            process
              .cwd()
              .split('\\')
              .join('/') +
            '/data' +
            val +
            '")',
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
  overflow: hidden;
}
</style>
