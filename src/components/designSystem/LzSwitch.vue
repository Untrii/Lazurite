<template>
  <div class="press-switch" :class="rootClasses" @click="onClick">
    <div class="text">
      <slot></slot>
    </div>
    <div class="switch-input" :class="switchClasses">
      <div class="switch-input__brick switch-input__brick-small" style="background:#2c3e50"></div>
      <div class="switch-input__brick" style="background:#61778e"></div>
      <div class="switch-input__brick switch-input__brick-small" style="background:#c4ddef"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Watch } from 'vue-property-decorator'
import { Vue } from 'vue-class-component'
import assets from '@/assets'

export default class LzPressSwitch extends Vue {
  @Prop({ default: false }) checked!: boolean
  @Prop({ default: 'medium' }) size!: string

  localValue = this.checked

  @Watch('value')
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
    const result: string[] = []
    result.push('press-switch_' + this.size)
    return result
  }

  get switchClasses() {
    const result: string[] = []
    result.push('switch-input_' + this.size)
    if (this.localValue) result.push('switch-input_pressed')
    else result.push('switch-input_not-pressed')
    return result
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';

.press-switch {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr max-content;

  img {
    grid-column: 2;
  }

  &_small {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
  &_medium {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }
  &_large {
    height: 48px;
    line-height: 48px;
    font-size: 20px;
  }
}
.switch-input {
  overflow: hidden;
  display: inline-grid;
  grid-template-columns: 4fr 5fr 4fr;

  &__brick {
    height: 100%;
  }

  &__brick-small {
    height: 80%;
    transform: scaleX(0.8);
    margin-top: 10%;
  }

  &_pressed &__brick:first-child {
    margin-left: 0 !important;
    transition: 0.3s;
  }
  &_not-pressed &__brick:first-child {
    transition: 0.3s;
    transform: scaleX(0);
  }
  &_small {
    height: 24px;
    width: 48px;
    margin: 4px 0;
  }
  &_small &__brick {
    width: 24px;
    &:first-child {
      margin-left: -24px;
    }
  }

  &_medium {
    height: 28px;
    width: 56px;
    margin: 6px 0;
  }
  &_medium &__brick {
    width: 28px;
    &:first-child {
      margin-left: -28px;
    }
  }

  &_large {
    height: 32px;
    width: 64px;
    margin: 8px 0;
  }
  &_large &__brick {
    width: 32px;
    &:first-child {
      margin-left: -32px;
    }
  }
}
</style>
