<template>
  <div :class="rootClasses" @click="$emit('click')">
    <img :src="assets[image]" alt="" v-if="assets[image]" :class="imageClasses" />
    <img :src="image" alt="" v-else-if="image.trim().length > 0" :class="imageClasses" />
    <div :class="textClasses">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import assets from '@/assets'

@Component
export default class LzButton extends Vue {
  @Prop({ default: true }) blockLevel!: boolean
  @Prop({ default: 'medium' }) size!: string
  @Prop({ default: '' }) image!: string
  @Prop({ default: 'left' }) imagePosition!: string
  @Prop({ default: false }) imageBorder!: boolean
  @Prop({ default: 'primary' }) variant!: string
  @Prop({ default: false }) disabled!: boolean

  get assets() {
    return assets
  }

  get isImageCorrect() {
    if (assets[this.image] || this.image.trim().length > 0) return true
    else return false
  }

  get rootClasses() {
    let result: string[] = ['button']
    result.push('button_' + this.size)
    result.push('button_' + this.variant + (this.disabled ? '_disabled' : ''))
    if (this.blockLevel) result.push('button_block-level')

    return result
  }

  get textClasses() {
    let result: string[] = []
    if (this.isImageCorrect) {
      result.push('button__text_align-image')
      result.push('button__text_with-' + this.size + '-image')
    } else result.push('button__text_centered')

    return result
  }

  get imageClasses() {
    let result: string[] = []
    if (this.imagePosition == 'right') result.push('button__image_right')
    if (this.imageBorder) result.push('button__image_border')
    return result
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.button {
  cursor: pointer;

  img {
    margin-left: 8px;
  }

  &__image_border {
    border: 1px solid $gray-light;
  }
  &__image_right {
    float: right;
  }

  &__text {
    &_centered {
      width: 100%;
      text-align: center;
    }
    &_align-image {
      display: inline-block;
    }

    &_with-small-image {
      line-height: 32px;
    }
    &_with-medium-image {
      line-height: 40px;
    }
    &_with-large-image {
      line-height: 48px;
    }
  }

  &_block-level {
    width: 100%;
  }

  &_primary {
    background-color: $button-primary;
    color: white;
    &:hover {
      transition: 0.2s;
      background-color: $button-primary-hover;
    }
    &:not(:hover) {
      background-color: $button-primary;
      transition: 0.2s;
    }
  }
  &_secondary {
    background-color: $button-secondary;
    color: white;
    &:hover {
      transition: 0.2s;
      background-color: $button-secondary-hover;
    }
    &:not(:hover) {
      background-color: $button-secondary;
      transition: 0.2s;
    }
  }
  &_transparent {
    background-color: rgba($color: #000000, $alpha: 0);
    &:hover {
      background-color: rgba($color: #ffffff, $alpha: 0.5);
    }
    &:not(:hover) {
      background-color: rgba($color: #000000, $alpha: 0);
      transition: 0.2s;
    }
    &_disabled {
      color: gray;
      background-color: rgba($color: #000000, $alpha: 0);
    }
  }

  &_small {
    min-height: 28px;
    padding: 4px 8px;
    font-size: 14px;

    img {
      width: 32px;
    }
  }
  &_medium {
    min-height: 36px;
    padding: 6px 12px;
    font-size: 16px;

    img {
      width: 40px;
    }
  }
  &_large {
    min-height: 48px;
    padding: 8px 16px;
    font-size: 20px;
    img {
      width: 52px;
    }
  }
}
</style>
