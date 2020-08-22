<template>
  <div class="range-input" :size="size" :style="rootStyle">
    <lz-prepend :size="size" class="range-input__prepend">
      {{ prepend }}
    </lz-prepend>

    <div class="range-input__range" @mousedown="onMouseDown($event)" @mousemove="onMouseMove($event)">
      <div class="range_filled" :style="filledRangeStyle"></div>
    </div>
    <div class="range-input__reset-button" @click="$emit('reset')">
      reset
    </div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import LzPrepend from './LzPreprend.vue'

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

  localValue = this.value

  @Watch('value')
  onValueChange(newVal) {
    this.localValue = newVal
  }

  isPressed = false
  onMouseDown(event: MouseEvent) {
    this.isPressed = true
    let onMouseUp = () => {
      this.isPressed = false
      this.$emit('inputEnded', this.localValue)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mouseup', onMouseUp)
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isPressed) return
    let width = this.$el.children[1].clientWidth
    let offset = event.offsetX
    let progress = (offset / width) * (this.max - this.min)
    let flooredProgress = Math.round(progress / this.step) * this.step
    flooredProgress = Math.min(this.max, flooredProgress)
    this.localValue = flooredProgress
    this.$emit('valueChanged', flooredProgress)
  }

  get filledRangeStyle() {
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
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.range-input {
  display: inline-grid;
  grid-template-columns: max-content 1fr max-content;
  width: 100%;
  background-color: white;

  &:hover &__prepend {
    font-size: 0;
    opacity: 0;
    padding-left: 0;
    padding-right: 0;
    transition: 0.5s;
  }
  &:not(:hover) &__prepend {
    //width: 100%;
    transition: 0.5s;
  }

  &__range {
    height: 100%;
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
  background-color: $blue-lighter;
}
</style>
