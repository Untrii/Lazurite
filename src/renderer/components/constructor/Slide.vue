<template>
  <div
    class="slide"
    :style="rootStyle"
    :class="rootClasses"
    v-if="isRedactable"
  >
    <redactable-base-element
      v-for="id in elementIds"
      :key="id"
      :id="id"
      :scale="width / 1920"
    ></redactable-base-element>
  </div>
  <div class="slide" :style="rootStyle" :class="rootClasses" v-else>
    <base-element
      v-for="id in elementIds"
      :key="id"
      :id="id"
      :scale="width / 1920"
    ></base-element>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseElement from '@/components/elements/BaseElement.vue'
import RedactableBaseElement from './redactableElements/RedactableBaseElement.vue'
import VisualisationService from '@/services/VisualisationService'
import ITheme, { getBlankTheme, BackgroundType } from '@/entities/ITheme'

let service = new VisualisationService()

@Component({
  components: {
    BaseElement,
    RedactableBaseElement,
  },
})
export default class Slide extends Vue {
  elementIds: string[] = []
  theme: ITheme = getBlankTheme()
  @Prop(Number) index
  @Prop(Number) width
  @Prop(Number) height
  @Prop(Boolean) isRedactable

  @Watch('index')
  getState() {
    this.elementIds = Array.from(service.slideByIndex(this.index).keys())
    this.theme = { ...service.theme }
  }

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    service.addOnChangeListener(this.onChangeListener)
  }
  beforeDestroy() {
    service.removeOnChangeListener(this.onChangeListener)
  }
  mounted() {
    requestAnimationFrame(() => this.animateSlideOpacity())
  }

  isVisible = false
  animateSlideOpacity() {
    console.log('anumate slide')
    let win: any = window
    if (!win.__enqueueSlideAnimation) {
      win.__enqueueSlideAnimation = (func) => {
        if (!win.__slideAnimationQueue) {
          win.__slideAnimationQueue = []
        }
        win.__slideAnimationQueue.push(func)
        if (!win.__slideAnimationPlanned) {
          win.__slideAnimationPlanned = true
          let animateFunction = () => {
            win.__slideAnimationQueue[0]()
            win.__slideAnimationQueue.splice(0, 1)
            if (win.__slideAnimationQueue.length > 0)
              requestAnimationFrame(animateFunction)
            else win.__slideAnimationPlanned = false
          }
          requestAnimationFrame(animateFunction)
        }
      }
    }
    win.__enqueueSlideAnimation(() => {
      this.isVisible = true
    })
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
      case BackgroundType.Gradicolor:
        bgStyle = {
          backgroundImage: 'linear-gradient(' + val + ')',
        }
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
  get rootClasses() {
    let result: string[] = []
    if (this.isVisible)
      result.push(this.isRedactable ? 'slide_visible-fast' : 'slide_visible')
    return result
  }
}
</script>

<style>
.slide {
  position: relative;
  overflow: hidden;
  opacity: 0;
}
.slide_visible {
  opacity: 1 !important;
  transition: 0.7s;
}
.slide_visible-fast {
  opacity: 1 !important;
}
</style>
