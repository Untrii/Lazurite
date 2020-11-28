<template>
  <div class="text-input">
    <lz-prepend :size="size" v-if="prepend.length > 0">
      {{ prepend }}
    </lz-prepend>
    <div v-else></div>
    <input
      type="text"
      @input.stop="onInput($event)"
      :value="value"
      :class="rootClasses"
    />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

export default class LzTextInput extends Vue {
  @Prop() value: string = ''
  @Prop() size: string = 'medium'
  @Prop() prepend: string = ''

  onInput(event) {
    console.log(event.target.value)
    this.$emit('input', event.target.value)
  }

  get rootClasses() {
    const result: string[] = []
    result.push('text-input_' + this.size)
    return result
  }
}
</script>

<style lang="scss" scoped>
.text-input {
  height: 32px;
  width: 100%;

  display: inline-grid;
  grid-template-columns: min-content 1fr;

  &_small {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    padding: 0 12px;
  }
  &_medium {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    padding: 0 16px;
  }
  &_large {
    height: 48px;
    line-height: 48px;
    font-size: 20px;
    padding: 0 20px;
  }
}
</style>
