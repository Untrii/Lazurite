<template>
  <div>
    <div class="control-buttons" :style="controlDockStyle" v-show="isSelected">
      <div
        class="control-buttons__item"
        v-for="(button, index) in buttons"
        :key="index"
        @click.stop.prevent="button.handler"
        @mousedown.stop.prevent
        @mouseup.stop.prevent
        @mouseenter="showPrompt(button.prompt)"
        @mouseleave="hidePrompt(button.prompt)"
      >
        <img :src="button.image" alt="" />
      </div>
      <div class="control-buttons__prompt" v-if="prompt != ''">
        {{ prompt }}
      </div>
    </div>
    <text-block
      v-bind="$attrs"
      class="content"
      v-if="!isRedacting"
    ></text-block>
    <div v-else>
      <div
        @click.stop
        class="text-block text-block_editable"
        :style="blockStyle"
        v-html="content"
        contenteditable="true"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ConstructorService from '@/services/ConstructorService'
import TextBlock from '@/components/elements/TextBlock.vue'
import assets from '@/assets'
import VisualisationService from '@/services/VisualisationService'
import Color from '@/entities/Color'
import HistoryService from '@/services/HistoryService'

let service = new ConstructorService()
let visualisationService = new VisualisationService()
let historyService = new HistoryService()

@Component({
  components: { TextBlock },
})
export default class RedactableTextBlock extends Vue {
  @Prop() fontFamily!: string
  @Prop() fontSize!: number
  @Prop() fontWeight!: number
  @Prop() content!: string
  @Prop({ default: () => new Color(false) }) color!: Color
  @Prop({ default: () => new Color(true) }) backgroundColor!: Color

  @Prop() id!: string
  @Prop() scale!: number

  blockSize = 0
  isSelected = false
  isRedacting = false
  x = 0

  prompt = ''

  // onBoldClick() {}
  // onItalicClick() {}
  // onStrikethroughClick() {}
  // onUnderlineClick() {}
  // onClearClick() {}

  buttons = [
    {
      image: assets.edit,
      handler: () => this.onEditClick(),
      prompt: 'Edit element',
    },
    {
      image: assets.bold,
      handler: () => this.onBoldClick(),
      prompt: 'Bold',
    },
    {
      image: assets.italic,
      handler: () => this.onItalicClick(),
      prompt: 'Italic',
    },
    {
      image: assets.strikethrough,
      handler: () => this.onStrikethroughClick(),
      prompt: 'Strikethrough',
    },
    {
      image: assets.underline,
      handler: () => this.onUnderlineClick(),
      prompt: 'Underline',
    },
    {
      image: assets.clear,
      handler: () => this.onClearClick(),
      prompt: 'Clear style',
    },
  ]

  getState() {
    let element = visualisationService.elementById(this.id)
    this.isSelected = service.selectedObjectId == this.id
    this.blockSize = element.height
    this.x = element.top
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  onEditClick() {
    let newRedactState = !this.isRedacting
    if (!newRedactState) {
      let el = document.querySelector('.text-block_editable')
      if (el) {
        historyService.registerTextChange(this.id, this.content, el.innerHTML)
        service.changeObjectProperty(this.id, 'content', el.innerHTML)
      }
    }
    this.isRedacting = newRedactState
    this.buttons[0].image = newRedactState ? assets.tick : assets.edit
    this.buttons[0].prompt = newRedactState ? 'Save' : 'Edit element'
    this.prompt = newRedactState ? 'Save' : 'Edit element'

    this.$emit(newRedactState ? 'locked' : 'unlocked')
  }
  onBoldClick() {
    let virtualElement = document.createElement('content')
    virtualElement.innerHTML = this.content
    if (!this.isRedacting) {
    }
  }
  onItalicClick() {}
  onStrikethroughClick() {}
  onUnderlineClick() {}
  onClearClick() {}

  showPrompt(text) {
    this.prompt = text
  }

  hidePrompt(text) {
    if (this.prompt == text) this.prompt = ''
  }

  get assets() {
    return assets
  }

  get controlDockStyle() {
    if (this.x < 48 / this.scale)
      return {
        marginTop: this.blockSize * this.scale + 8 + 'px',
      }
    else return {}
  }

  get blockStyle() {
    return {
      fontFamily: "'" + this.fontFamily + "'",
      fontSize: this.fontSize * this.scale + 'px',
      fontWeight: this.fontWeight,
      color: this.color.toCssColor(),
      backgroundColor: this.backgroundColor.toCssColor(),
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';

.control-buttons {
  position: absolute;
  margin-top: -40px;
  margin-left: 10px;
  display: inline-flex;
  transition: 0.3s;

  &__item {
    background: $gray-extradark;
    width: 32px;
    height: 32px;
    display: inline-block;

    img {
      margin: 8px;
      height: 16px;
      width: 16px;
    }

    &:hover {
      background: $gray-dark;
      cursor: pointer;
    }

    &:not(:last-child) {
      border-right: 1px solid $gray-dark;
    }

    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

  &__prompt {
    background: $gray-extradark;
    padding: 4px 10px;
    height: 32px;
    display: inline-block;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;

    color: white;
  }
}
.content {
  width: 100%;
  height: 100%;
}

.text-block {
  outline: none;
  width: 100%;
  height: 100%;
  word-wrap: none;
  word-break: break-word;
}
.text-block:active,
.text-block:hover,
.text-block:focus {
  outline: 0;
  outline-offset: 0;
}
</style>
