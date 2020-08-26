<template>
  <div class="press-switch" :class="rootClasses" @click="onClick">
    <img :src="assets[image]" alt="" v-if="assets[image]" />
    <img :src="image" alt="" v-else-if="image.trim().length > 0" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import assets from '@/assets'

@Component
export default class LzPressSwitch extends Vue {
  @Prop({ default: false }) checked!: boolean
  @Prop({ default: 'medium' }) size!: string
  @Prop({ default: '' }) image!: string

  localValue = this.checked

  @Watch('checked')
  onValueChange(newVal) {
    this.localValue = newVal
  }

  onClick() {
    this.localValue = !this.localValue
    this.$emit('change', this.localValue)
  }

  get assets() {
    return assets
  }

  get rootClasses() {
    let result: string[] = []
    result.push('press-switch_' + this.size)
    if (this.localValue) result.push('press-switch_pressed')
    return result
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';

.press-switch {
  width: 100%;
  background-color: white;
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  &:hover {
    background-color: $gray-lighter;
    transition: 0.3s;
  }
  &:not(:hover) {
    transition: 0.3s;
  }

  img {
    grid-column: 2;
  }

  &_small {
    height: 32px;
    padding: 6px 8px;
    font-size: 14px;
    img {
      height: 20px;
    }
  }

  &_medium {
    height: 40px;
    padding: 8px 12px;
    font-size: 16px;
    img {
      height: 24px;
    }
  }

  &_large {
    height: 48px;
    padding: 10px 16px;
    font-size: 20px;
    img {
      height: 28px;
    }
  }

  &_pressed {
    background-color: $gray-bright !important;
    &:hover {
      background-color: $gray-lighter !important;
      transition: 0.3s;
    }
    &:not(:hover) {
      transition: 0.3s;
    }
  }
}
</style>
