<template>
  <div class="input-root">
    <lz-prompt :text="`${prepend}: ${flooredValue}`" :is-visible="isHovered"></lz-prompt>
    <div
      class="range-input"
      :size="size"
      :style="rootStyle"
      @mousemove="onMouseMove($event)"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @mousedown="onMouseDown($event)"
    >
      <lz-prepend :size="size" class="range-input__prepend" :min-width="isHovered ? 0 : minPrependWidth">
        {{ prepend }}
      </lz-prepend>

      <div class="range-input__range">
        <div class="range_filled" :style="filledRangeStyle"></div>
      </div>

      <!-- <input type="number" :min="min" :max="max" :step="step" class="range-input__input" /> -->
      <div class="range-input__reset-button" @mousedown.stop="$emit('reset')">
        reset
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import LzPrepend from './LzPrepend.vue'

@Component({
  components: {
    LzPrepend,
  },
})
export default class LzRangeInput extends Vue {
  @Prop({ default: 'medium' }) size!: string
  @Prop({ default: 0 }) value!: number
  @Prop({ default: '' }) prepend!: string
  @Prop({ default: 0.1 }) step!: number
  @Prop({ default: 0 }) min!: number
  @Prop({ default: 10 }) max!: number
  @Prop({ default: 0 }) minPrependWidth!: number

  localValue = this.value

  @Watch('value')
  onValueChange(newVal) {
    this.localValue = newVal
  }

  get flooredValue() {
    let valParts = this.localValue.toString().split('.')
    let intPart = valParts[0]
    let fractPart = valParts[1] ?? ''
    let fractCharArr: string[] = []
    for (let i = 0; i < fractPart.length && i < 2; i++) {
      const char = fractPart[i]
      fractCharArr.push(char)
    }
    if (fractCharArr[fractCharArr.length - 1] == '0') fractCharArr.pop()
    if (fractCharArr.length == 0) fractCharArr.push('0')

    return intPart + '.' + fractCharArr.join('')
  }

  isPressed = false
  onMouseDown(event: MouseEvent) {
    this.isPressed = true
    let onMouseUp = () => {
      this.isPressed = false
      this.$emit('change', this.localValue)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mouseup', onMouseUp)
    this.onMouseMove(event)
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isPressed) return
    let range = this.$el.children[1]
    let width = (range.clientWidth - 45) * 0.95 //minus reset button
    let offset = event.pageX - range.getBoundingClientRect().x - width / 19
    let progress = this.min + (offset / width) * (this.max - this.min)
    let flooredProgress = Math.round(progress / this.step) * this.step
    flooredProgress = Math.min(this.max, flooredProgress)
    flooredProgress = Math.max(this.min, flooredProgress)
    this.localValue = flooredProgress
    this.$emit('input', flooredProgress)
  }

  get filledRangeStyle() {
    if (this.isHovered) {
      return {
        width: (95 * this.localValue) / (this.max - this.min) + 5 + '%',
        borderRight: '12px solid #61778e',
      }
    } else
      return {
        width: (100 * this.localValue) / (this.max - this.min) + '%',
      }
  }

  get rootStyle() {
    switch (this.size) {
      case 'small':
        return { height: '32px' }
      case 'medium':
        return { height: '40px' }
      case 'small':
        return { height: '48px' }
    }
    return {}
  }

  isHovered = false

  onMouseEnter() {
    this.isHovered = true
  }
  onMouseLeave() {
    this.isHovered = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.range-input {
  position: relative;
  top: 0;
  display: inline-grid;
  grid-template-columns: max-content 1fr max-content;
  width: 100%;
  background-color: white;

  &:hover &__prepend {
    width: 0;
    opacity: 0;
    padding-left: 0;
    padding-right: 0;
    transform: translateX(-120px) scaleX(0);
  }
  &:not(:hover) &__prepend {
    //width: 100%;
  }

  &__inner-prepend {
    user-select: none;
  }
  &:hover &__inner-prepend {
    opacity: 1;
    transition: 0.1s;
  }
  &:not(:hover) &__inner-prepend {
    opacity: 0;
    transition: 0.1s;
  }

  &__input {
    height: 100%;
    &:focus {
      outline: none;
    }
  }

  &__reset-button {
    user-select: none;
    width: 0px;
    line-height: 100%;
    font-size: 12px;
    overflow-x: hidden;
    padding: 0px;
    padding-top: 10px;
  }
  &:hover &__reset-button {
    width: 45px;
    padding: 10px;
    transition: 0.5s;
  }
  &:not(:hover) &__reset-button {
    width: 0px;
    padding: 10px 0px 0px 0px;
    transition: 0.5s;
  }
}

.range_filled {
  height: 100%;
  background-color: $blue-normal;
}

.input-root {
  &:hover .prompt {
    opacity: 1;
    transition: 0.3s;
  }
  &:not(:hover) .prompt {
    opacity: 0;
    transition: 0.1s;
  }
}
</style>
