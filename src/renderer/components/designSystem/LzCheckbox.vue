<template>
  <div class="checkbox" :class="rootClasses" @click="onClick">
    <div type="checkbox" class="checkbox-input" :class="checkboxClasses"></div>
    <div class="text">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import assets from '@/assets'

@Component
export default class LzCheckbox extends Vue {
  @Prop({ default: false }) checked!: boolean
  @Prop({ default: 'small' }) size!: string

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
    result.push('checkbox_' + this.size)
    return result
  }

  get checkboxClasses() {
    let result: string[] = []
    result.push('checkbox-input_' + this.size)
    if (this.localValue) result.push('checkbox-input_pressed')
    else result.push('checkbox-input_not-pressed')
    return result
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';

.checkbox {
  width: 100%;
  display: grid;
  grid-template-columns: max-content 1fr;

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
.checkbox-input {
  overflow: hidden;
  display: inline-grid;
  grid-template-columns: max-content max-content max-content;

  border: 2px solid $blue-normal;

  &_not-pressed {
    background: white;
  }

  &_pressed {
    background: $blue-normal;
  }

  &_small {
    height: 20px;
    width: 20px;
    margin: 6px 0;
  }

  &_medium {
    height: 24px;
    width: 24px;
    margin: 8px 0;
  }

  &_large {
    height: 28px;
    width: 28px;
    margin: 10px 0;
  }
}
.text {
  margin-left: 10px;
}
</style>
