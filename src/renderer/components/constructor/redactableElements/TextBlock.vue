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
    <text-block v-bind="$attrs" class="content" v-if="!isRedacting"></text-block>
    <div v-else>
      <div
        @click.stop
        class="text-block text-block_editable"
        :id="'tbr' + id"
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
      handler: () => this.applyDecoration('bold'),
      prompt: 'Bold',
    },
    {
      image: assets.italic,
      handler: () => this.applyDecoration('italic'),
      prompt: 'Italic',
    },
    {
      image: assets.strikethrough,
      handler: () => this.applyDecoration('strikeThrough'),
      prompt: 'Strikethrough',
    },
    {
      image: assets.underline,
      handler: () => this.applyDecoration('underline'),
      prompt: 'Underline',
    },
    {
      image: assets.clear,
      handler: () => this.applyDecoration('removeFormat'),
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
    console.log('text block')
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

  applyDecoration(name: string) {
    let virtualElement = document.querySelector('#tbr' + this.id) ?? document.createElement('content')

    let getStyledText = function(node: ChildNode, inheritStyle: string[]): { text: string; style: Set<string> }[] {
      let result: { text: string; style: Set<string> }[] = []
      for (let i = 0; i < node.childNodes.length; i++) {
        const element = node.childNodes[i]
        if (element.nodeName == '#text') {
          let decorations = new Set<string>()
          for (const item of inheritStyle) {
            decorations.add(item)
          }
          result.push({ text: element.textContent ?? '', style: decorations })
        } else {
          let style = [...inheritStyle]
          style.push(element.nodeName)

          result = [...result, ...getStyledText(element, style)]
        }
      }
      return result
    }

    let getHTML = function(styledText: { text: string; style: Set<string> }[]): string {
      let result: string[] = []
      if (styledText.length == 1) {
        let text = styledText[0]
        let t = text.text
        for (const item of text.style) {
          t = `<${item}>${t}</${item}>`
        }
        return t
      } else {
        for (const item of styledText) {
          result.push(getHTML([item]))
        }
        return result.join('')
      }
    }

    let isThisTextBlockSelected = () => {
      let selection = getSelection()
      if (!selection) return false
      if (selection.type != 'Range') return false
      let currentElement = document.querySelector('#tbr' + this.id)
      let focusedElement: Node | null | undefined = getSelection()?.focusNode ?? document
      let result = false
      while (focusedElement?.parentNode != document && focusedElement) {
        if (focusedElement == currentElement) result = true
        focusedElement = focusedElement?.parentNode
      }
      return result
    }

    let applyDecorationInStyle = function(styledText: { text: string; style: Set<string> }[]) {
      let dCount = 0
      for (let i = 0; i < styledText.length; i++) {
        switch (name) {
          case 'bold':
            if (styledText[i].style.has('B')) dCount++
            styledText[i].style.add('B')
            break
          case 'italic':
            if (styledText[i].style.has('I')) dCount++
            styledText[i].style.add('I')
            break
          case 'underline':
            if (styledText[i].style.has('U')) dCount++
            styledText[i].style.add('U')
            break
          case 'strikeThrough':
            if (styledText[i].style.has('STRIKE')) dCount++
            styledText[i].style.add('STRIKE')
            break
          case 'removeFormat':
            let isDiv = styledText[i].style.has('DIV')
            styledText[i].style.clear()
            if (isDiv) styledText[i].style.add('DIV')
            break
        }
      }
      for (let i = 0; i < styledText.length; i++) {
        if (dCount == styledText.length) {
          switch (name) {
            case 'bold':
              styledText[i].style.delete('B')
              break
            case 'italic':
              styledText[i].style.delete('I')
              break
            case 'underline':
              styledText[i].style.delete('U')
              break
            case 'strikeThrough':
              styledText[i].style.delete('STRIKE')
              break
          }
        }
      }
      return styledText
    }

    if (!isThisTextBlockSelected()) {
      let html = getHTML(applyDecorationInStyle(getStyledText(virtualElement, [])))
      historyService.registerTextChange(this.id, this.content, html)
      service.changeObjectProperty(this.id, 'content', html)
    } else document.execCommand(name)
  }

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
