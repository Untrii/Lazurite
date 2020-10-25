<template>
  <div class="prompt" v-show="isVisible" :style="promptStyle">
    <div class="prompt__body">{{ text }}</div>
    <div class="prompt__anchor">
      <svg>
        <polygon points="0,0 16,0 8,8" fill="#61778e"></polygon>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Watch } from 'vue-property-decorator'
import { Vue } from 'vue-class-component'

export default class LzPrompt extends Vue {
  @Prop() isVisible = false
  @Prop() text = ''
  @Prop() fullSize = false

  promptOpacity = 0

  @Watch('isVisible')
  animatePrompt() {
    if (this.isVisible) {
      if (this.promptOpacity >= 1) return
      this.promptOpacity += 0.2
      requestAnimationFrame(() => this.animatePrompt())
    } else {
      if (this.promptOpacity <= 0) return
      this.promptOpacity -= 0.2
      requestAnimationFrame(() => this.animatePrompt())
    }
  }

  get promptStyle() {
    const result: any = {}
    result.opacity = this.promptOpacity
    if (this.fullSize) {
      result.width = '100%'
      result.marginLeft = '-50%'
    }
    return result
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.prompt {
  position: relative;
  z-index: 100;
  top: -40px;
  margin-bottom: -40px;
  left: 50%;
  width: 50%;
  margin-left: -25%;
  height: 40px;
  opacity: 0;

  &__body {
    background-color: $blue-lighter;
    text-align: center;
    line-height: 32px;
    height: 32px;
    font-size: 14px;
    color: white;
    min-width: fit-content;
    overflow: hidden;
  }
  &__anchor {
    margin: auto;
    width: 16px;
    height: 8px;
    svg {
      width: 16px;
      height: 8px;
      margin-top: -20px;
    }
  }
}
</style>
