<template>
  <div class="slide" :style="rootStyle" :class="rootClasses" v-if="isRedactable">
    <redactable-base-element
      v-for="id in elementIds"
      :key="id"
      :id="id"
      :scale="width / 1920"
    ></redactable-base-element>
    <div class="grid" v-if="isGridShown"><div class="grid__cell" v-for="i in range(gridSize)" :key="i"></div></div>
  </div>
  <div class="slide" :style="rootStyle" :class="rootClasses" v-else>
    <base-element v-for="id in elementIds" :key="id" :id="id" :scale="width / 1920"></base-element>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import BaseElement from '@/components/elements/BaseElement.vue'
import RedactableBaseElement from './redactableElements/RedactableBaseElement.vue'
import ConstrctorStore from '@/services/store/ConstructorStore'
import { BackgroundType } from '@/entities/ITheme'

const store = new ConstrctorStore()

@Options({
  components: {
    BaseElement,
    RedactableBaseElement,
  },
})
export default class Slide extends Vue {
  get elementIds() {
    return Array.from(store.slideByIndex(this.index).keys())
  }
  get theme() {
    return store.presentation.theme
  }
  @Prop(Number) index
  @Prop(Number) width
  @Prop(Number) height
  @Prop(Boolean) isRedactable

  mounted() {
    requestAnimationFrame(() => this.animateSlideOpacity())
  }

  range(size: number) {
    let result = new Array(size)
    return result
  }

  get isGridShown() {
    return store.isGridEnabled
  }

  get gridSize() {
    return store.gridSize
  }

  isVisible = false
  animateSlideOpacity() {
    const win: any = window
    if (!win.__enqueueSlideAnimation) {
      win.__enqueueSlideAnimation = (func) => {
        if (!win.__slideAnimationQueue) {
          win.__slideAnimationQueue = []
        }
        win.__slideAnimationQueue.push(func)
        if (!win.__slideAnimationPlanned) {
          win.__slideAnimationPlanned = true
          const animateFunction = () => {
            win.__slideAnimationQueue[0]()
            win.__slideAnimationQueue.splice(0, 1)
            if (win.__slideAnimationQueue.length > 0) requestAnimationFrame(animateFunction)
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
    const theme = this.theme

    let val = theme.backgroundValue
    const type = theme.backgroundType
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
          backgroundImage: `url('local-img://${store.dataFolder}/${val}')`,
          backgroundSize: '20%',
        }
        break
      case BackgroundType.Image:
        bgStyle = {
          backgroundImage: `url('local-img://${store.dataFolder}/${val}')`,
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
    const result: string[] = []
    if (this.isVisible) result.push(this.isRedactable ? 'slide_visible-fast' : 'slide_visible')
    return result
  }
}
</script>

<style lang="scss">
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

.grid {
  display: inline-grid;
  grid-template-rows: repeat(9, 1fr);
  grid-template-columns: repeat(16, 1fr);
  width: 100%;
  height: 100%;

  &__cell {
    // width: 6.25%;
    // height: 11.1111%;
    width: 100%;
    height: 100%;
    border-top: 1px dashed gray;
    border-left: 1px dashed gray;
  }

  border-bottom: 1px dashed gray;
  border-right: 1px dashed gray;
}
</style>
