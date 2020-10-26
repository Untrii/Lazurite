<template>
  <div
    class="number-input"
    :class="rootClasses"
    @focus="isFocused = true"
    @blur="isFocused = false"
  >
    <lz-prepend :size="size" v-if="prepend.length > 0">
      {{ prepend }}
    </lz-prepend>
    <div v-else></div>
    <div
      class="number-input__user-input"
      :class="userInputClasses"
      contenteditable="true"
      @keypress="onKeyPress($event)"
      @keydown="onKeyDown($event)"
      @paste="onPaste($event)"
      @input="onInput($event)"
      @mousewheel="onMouseWheel($event)"
    >
      {{ visualisableValue }}
    </div>
    <div class="number-input__buttons">
      <div
        class="number-input__button"
        @mousedown="incrementStart"
        @mouseup="incrementEnd"
        @mouseleave="incrementEnd"
        @click.stop
      >
        <svg>
          <rect x="4" y="0" width="2" height="10" fill="#C4C4C4" />
          <rect x="0" y="4" width="10" height="2" fill="#C4C4C4" />
        </svg>
      </div>
      <div
        class="number-input__button"
        @mousedown="decrementStart"
        @mouseup="decrementEnd"
        @mouseleave="decrementEnd"
        @click.stop
      >
        <svg>
          <rect x="0" y="4" width="10" height="2" fill="#C4C4C4" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Watch } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import Hotkeys from '@/utils/Hotkeys'
import LzPrepend from './LzPrepend.vue'

@Options({
  components: {
    LzPrepend,
  },
})
export default class LzNumberInput extends Vue {
  @Prop({ default: true }) acceptFloat!: boolean
  @Prop({ default: 0 }) value!: number
  @Prop({ default: '' }) prepend!: string
  @Prop({ default: 'medium' }) size!: string
  @Prop({ default: 9999999 }) max!: number
  @Prop({ default: -9999999 }) min!: number

  localValue = this.value
  isFocused = false

  @Watch('value')
  onValueChange(newValue) {
    if (newValue != this.localValue) {
      this.localValue = newValue
      this.visualisableValue = this.localValue
    }
  }

  modifier = 1

  changeValue(value) {
    if (value > this.max) value = this.max
    if (value < this.min) value = this.min
    this.localValue = this.acceptFloat ? parseFloat(value) : parseInt(value)
    this.$emit('input', value)
    this.$emit('update:value', value)
  }

  visualisableValue = this.localValue

  get rootClasses() {
    const result: string[] = []
    result.push('number-input_' + this.size)
    return result
  }

  get prependClasses() {
    const result: string[] = []
    result.push('number-input__prepend_' + this.size)
    if (this.prepend.trim().length == 0)
      result.push('number-input__prepend_no-prepend')
    return result
  }

  get userInputClasses() {
    const result: string[] = []
    result.push('number-input__prepend_' + this.size)
    return result
  }

  onKeyPress(event: KeyboardEvent) {
    const charCode = event.which ?? 0
    console.log(charCode)
    const char = String.fromCharCode(charCode)
    if ((char >= '0' && char <= '9') || char == ',' || char == '.') return
    event.preventDefault()
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key == 'Delete') event.stopPropagation()
  }

  onPaste(event: ClipboardEvent) {
    if (!event.clipboardData) return
    const pasteData = event.clipboardData.getData('text')
    const resultString: string[] = []
    for (let i = 0; i < pasteData.length; i++) {
      const char = pasteData.charAt(i)
      if ((char >= '0' && char <= '9') || char == ',' || char == '.')
        resultString.push(char)
    }

    const filteredPasteData = resultString.join('')
    if (filteredPasteData == pasteData) return

    event.preventDefault()
    document.execCommand('insertText', false, filteredPasteData)
    console.log(event)
  }

  onMouseWheel(event: WheelEvent) {
    event.stopPropagation()
    event.preventDefault()
    if (event.deltaY < 0) {
      this.incrementStart()
      this.incrementEnd()
    } else {
      this.decrementStart()
      this.decrementEnd()
    }
  }

  onInput(event: InputEvent) {
    const src: any = event.srcElement
    this.changeValue(src.innerText)
    this.$emit('change', this.localValue)
  }

  recalculateModifier() {
    if (Hotkeys.shift) this.modifier = 10
    else if (Hotkeys.alt) this.modifier = 100
    else this.modifier = 1
  }

  isIncrementing = false
  isDecrementing = false
  incrementStartTime = new Date()
  decrementStartTime = new Date()
  incrementStartValue = 0
  decrementStartValue = 0
  incrementStart() {
    this.recalculateModifier()

    this.changeValue(this.localValue + this.modifier)
    this.visualisableValue = this.localValue
    this.incrementStartValue = this.localValue

    if (!this.isIncrementing) {
      setTimeout(() => this.increment(), 250)
      this.incrementStartTime = new Date()
    }
    this.isIncrementing = true
  }
  incrementEnd() {
    this.isIncrementing = false
  }
  increment() {
    if (this.isIncrementing) {
      const incrementAmount = Math.floor(
        (new Date().getTime() - this.incrementStartTime.getTime()) / 100
      )
      this.changeValue(
        this.incrementStartValue + incrementAmount * this.modifier
      )
      this.visualisableValue = this.localValue
      setTimeout(() => this.increment(), 100)
    } else this.$emit('change', this.localValue)
  }
  decrementStart() {
    this.recalculateModifier()

    this.changeValue(this.localValue - this.modifier)
    this.visualisableValue = this.localValue
    this.decrementStartValue = this.localValue
    if (!this.isDecrementing) {
      setTimeout(() => this.decrement(), 250)
      this.decrementStartTime = new Date()
    }
    this.isDecrementing = true
  }
  decrementEnd() {
    this.isDecrementing = false
  }
  decrement() {
    if (this.isDecrementing) {
      const decrementAmount = Math.floor(
        (new Date().getTime() - this.decrementStartTime.getTime()) / 100
      )
      this.changeValue(
        this.decrementStartValue - decrementAmount * this.modifier
      )
      this.visualisableValue = this.localValue
      setTimeout(() => this.decrement(), 100)
    } else this.$emit('change', this.localValue)
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.number-input {
  height: 32px;
  width: 100%;
  display: inline-grid;
  grid-template-columns: max-content 1fr max-content;

  &:hover &__buttons {
    display: grid;
  }

  &__prepend {
    background-color: #e6e6eb;

    &_small {
      padding: 0 12px;
    }
    &_medium {
      padding: 0 16px;
    }
    &_large {
      padding: 0 20px;
    }
    &_no-prepend {
      padding: 0;
    }
  }

  &__user-input {
    overflow-x: hidden;
    overflow-y: hidden;
    background-color: white;
    &_small {
      padding: 0 12px;
    }
    &_medium {
      padding: 0 16px;
    }
    &_large {
      padding: 0 20px;
    }

    outline: 2px solid $gray-extralight;

    &:focus {
      outline: 2px solid $blue-lighter;
      z-index: 1000;
    }
  }

  &__buttons {
    display: none;
    grid-template-rows: 1fr 1fr;
    z-index: 1001;
  }
  &_small &__buttons {
    width: 16px;
    margin-left: -16px;
    // grid-template-rows: 1fr !important;
    // grid-template-columns: 1fr 1fr;
  }
  &_medium &__buttons {
    width: 20px;
    margin-left: -20px;
  }
  &_large &__buttons {
    width: 24px;
    margin-left: -24px;
  }

  &__button {
    display: grid;
    grid-template-rows: 1fr 10px 1fr;
    grid-template-columns: 1fr 10px 1fr;
    user-select: none;

    &:hover {
      background-color: $gray-dark;
    }

    svg {
      height: 10px;
      width: 10px;
      grid-row: 2;
      grid-column: 2;
    }
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
</style>
