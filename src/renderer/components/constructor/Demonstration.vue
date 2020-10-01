<template>
  <div
    class="demonstration"
    v-if="selectedSlideIndex >= 0"
    :class="rootClasses"
  >
    <slide
      :index="selectedSlideIndex"
      :width="currentSlideWidth"
      :height="currentSlideHeight"
      :isRedactable="false"
      :style="slideStyle"
    ></slide>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ConstructorService from '@/services/ConstructorService'
import Slide from './Slide.vue'
import Hotkeys from '@/utils/Hotkeys'

let service = new ConstructorService()

@Component({
  components: {
    Slide,
  },
})
export default class Demonstration extends Vue {
  selectedSlideIndex = -1
  isVisible = false
  animationEnded = false
  startSlideWidth = 1
  windowHeight = 0
  windowWidth = 0
  animationProgress = 0

  get demonstrationAreaHeight(): number {
    return this.windowHeight
  }
  get demonstrationAreaWidth(): number {
    return this.windowWidth
  }

  get startSlideHeight() {
    return (this.startSlideWidth / 16) * 9
  }

  get slideHeigth() {
    return Math.min(
      this.demonstrationAreaHeight,
      (this.demonstrationAreaWidth / 16) * 9
    )
  }

  get slideWidth() {
    return Math.min(
      this.demonstrationAreaWidth,
      (this.demonstrationAreaHeight / 9) * 16
    )
  }

  get currentSlideWidth() {
    return (
      (this.slideWidth - this.startSlideWidth) * this.animationProgress +
      this.startSlideWidth
    )
  }

  get currentSlideHeight() {
    return (
      (this.slideHeigth - this.startSlideHeight) * this.animationProgress +
      this.startSlideHeight
    )
  }

  get marginLeft(): number {
    if (this.slideWidth == this.demonstrationAreaWidth) return 0
    else return (this.demonstrationAreaWidth - this.slideWidth) / 2
  }

  get marginTop(): number {
    if (this.slideHeigth == this.demonstrationAreaHeight) return 0
    else return (this.demonstrationAreaHeight - this.slideHeigth) / 2
  }

  get currentMarginLeft() {
    return (
      (this.marginLeft - this.workspacePosition.x) * this.animationProgress +
      this.workspacePosition.x
    )
  }

  get currentMarginTop() {
    return (
      (this.marginTop - this.workspacePosition.y) * this.animationProgress +
      this.workspacePosition.y
    )
  }

  get workspacePosition(): { x: number; y: number } {
    return {
      x: service.previewModuleSize ?? 0 + 40,
      y: 51,
    }
  }

  recalcStartSlideWidth(): number {
    let result = 1

    result =
      window.innerWidth -
      (service.previewModuleSize ?? 0) -
      (service.instrumentsModuleSize ?? 0) -
      40
    if (
      window.innerHeight <
      (result / 16) * 9 + 75 + (service.timelineModuleSize ?? 0)
    )
      result =
        ((window.innerHeight - (service.timelineModuleSize ?? 0) - 75) / 9) * 16
    return result
  }

  getState() {
    this.selectedSlideIndex = service.selectedSlideIndex ?? -1
  }

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    service.addOnChangeListener(this.onChangeListener)
    this.windowHeight = window.innerHeight
    this.windowWidth = window.innerWidth
    this.startSlideWidth = this.recalcStartSlideWidth()
  }

  beforeDestroy() {
    service.removeOnChangeListener(this.onChangeListener)
  }
  mounted() {
    this.getState()
    window.addEventListener('resize', () => {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth
      this.startSlideWidth = this.recalcStartSlideWidth()
    })
    requestAnimationFrame(() => (this.isVisible = true))
    requestAnimationFrame(() => this.animate())

    Hotkeys.bind('z', () => service.selectSlide(this.selectedSlideIndex - 1))
    Hotkeys.bind('x', () => service.selectSlide(this.selectedSlideIndex + 1))
    Hotkeys.bind('c', () => {
      this.$emit('closed')
      document.exitFullscreen()
    })
    document.documentElement.requestFullscreen()
  }

  animate() {
    this.animationProgress += 0.02
    this.animationProgress = Math.min(1, this.animationProgress)
    if (this.animationProgress < 1) requestAnimationFrame(this.animate)
    else this.animationEnded = true
  }

  get rootClasses() {
    let result: string[] = []
    if (this.isVisible && !this.animationEnded)
      result.push('demonstration_appear')
    else if (this.animationEnded) result.push('demonstration_no-anim')
    return result
  }

  get slideStyle() {
    return {
      marginLeft: this.currentMarginLeft + 'px',
      marginTop: this.currentMarginTop + 'px',
      transition: '0s',
    }
  }
}
</script>

<style lang="scss" scoped>
.demonstration {
  z-index: 1005;
  position: fixed;
  top: 0px;
  height: calc(100vh - 0px);
  width: 100vw;
  background: rgba($color: #212529, $alpha: 0);
}

.demonstration_appear {
  background: rgba($color: #212529, $alpha: 1);
  transition: 1s;
}

.demonstration_no-anim {
  background: rgba($color: #212529, $alpha: 1);
  transition: 0s;
}
</style>
