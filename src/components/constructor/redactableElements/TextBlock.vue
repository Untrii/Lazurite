<template>
  <div style="width:100%;height:100%">
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
    <text-block v-bind="$props" class="content" v-if="!isRedacting"></text-block>
    <div v-else class="wrap" :style="wrapStyle">
      <div
        @click.stop
        @paste="onPaste"
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
import { Prop } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import TextBlock from '@/components/elements/TextBlock.vue'
import assets from '@/assets'
import Color from '@/entities/Color'
import IColor from '@/entities/IColor'
import HistoryService from '@/services/constructor/HistoryService'
import ConstrctorStore from '@/services/store/ConstructorStore'
import HotkeysService from '@/services/constructor/HotkeysService'
import SlideObjectService from '@/services/constructor/SlideObjectService'

const store = new ConstrctorStore()
const historyService = new HistoryService()
const hotkeysService = new HotkeysService()
const slideObjectService = new SlideObjectService()

@Options({
  components: { TextBlock },
})
export default class RedactableTextBlock extends Vue {
  @Prop() fontFamily!: string
  @Prop() fontSize!: number
  @Prop() fontWeight!: number
  @Prop() content!: string
  @Prop() horizontalAlign!: string
  @Prop() verticalAlign!: string
  @Prop({ default: () => new Color(false) }) color!: IColor
  @Prop({ default: () => new Color(true) }) backgroundColor!: IColor

  @Prop() id!: string
  @Prop() scale!: number

  get blockSize() {
    const element = store.elementById(this.id)
    return element.height
  }
  get isSelected() {
    return store.selectedObjectId == this.id
  }
  isRedacting = false
  get x() {
    const element = store.elementById(this.id)
    return element.top
  }

  prompt = ''

  // onBoldClick() {}
  // onItalicClick() {}
  // onStrikethroughClick() {}
  // onUnderlineClick() {}
  // onClearClick() {}

  onPaste(e) {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    console.log('text to past: ', text)
    e.target.ownerDocument.execCommand('insertText', false, text)
  }

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

  onEditClick() {
    const newRedactState = !this.isRedacting
    if (!newRedactState) {
      hotkeysService.bindDefaultConstructorHotkeys()
      const el = document.querySelector('.text-block_editable')
      if (el) {
        historyService.registerTextChange(this.id, this.content, el.innerHTML)
        slideObjectService.changeObjectProperty(this.id, 'content', el.innerHTML)
      }
    } else {
      hotkeysService.unbindDefaultConstructorHotkeys()
    }
    this.isRedacting = newRedactState
    this.buttons[0].image = newRedactState ? assets.tick : assets.edit
    this.buttons[0].prompt = newRedactState ? 'Save' : 'Edit element'
    this.prompt = newRedactState ? 'Save' : 'Edit element'

    this.$emit(newRedactState ? 'locked' : 'unlocked')
  }

  applyDecoration(name: string) {
    let virtualElement
    if (this.isRedacting) virtualElement = document.querySelector('#tbr' + this.id) ?? document.createElement('content')
    else {
      virtualElement = document.createElement('content')
      virtualElement.innerHTML = this.content
    }
    const getStyledText = function(node: ChildNode, inheritStyle: string[]): { text: string; style: Set<string> }[] {
      let result: { text: string; style: Set<string> }[] = []
      for (let i = 0; i < node.childNodes.length; i++) {
        const element = node.childNodes[i]
        if (element.nodeName == '#text') {
          const decorations = new Set<string>()
          for (const item of inheritStyle) {
            decorations.add(item)
          }
          result.push({ text: element.textContent ?? '', style: decorations })
        } else {
          const style = [...inheritStyle]
          style.push(element.nodeName)

          result = [...result, ...getStyledText(element, style)]
        }
      }
      return result
    }

    const getHTML = function(styledText: { text: string; style: Set<string> }[]): string {
      const result: string[] = []
      if (styledText.length == 1) {
        const text = styledText[0]
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

    const isThisTextBlockSelected = () => {
      const selection = getSelection()
      if (!selection) return false
      if (selection.type != 'Range') return false
      const currentElement = document.querySelector('#tbr' + this.id)
      let focusedElement: Node | null | undefined = getSelection()?.focusNode ?? document
      let result = false
      while (focusedElement?.parentNode != document && focusedElement) {
        if (focusedElement == currentElement) result = true
        focusedElement = focusedElement?.parentNode
      }
      return result
    }

    const applyDecorationInStyle = function(styledText: { text: string; style: Set<string> }[]) {
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
            const isDiv = styledText[i].style.has('DIV')
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
      const html = getHTML(applyDecorationInStyle(getStyledText(virtualElement, [])))
      historyService.registerTextChange(this.id, this.content, html)
      slideObjectService.changeObjectProperty(this.id, 'content', html)
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
    const color = new Color()
    color.fromOther(this.color)
    const backgroundColor = new Color()
    backgroundColor.fromOther(this.backgroundColor)
    return {
      fontFamily: "'" + this.fontFamily + "'",
      fontSize: this.fontSize * this.scale + 'px',
      fontWeight: this.fontWeight,
      color: color.toCssColor(),
      backgroundColor: backgroundColor.toCssColor(),
      textAlign: this.horizontalAlign,
    }
  }

  get wrapStyle() {
    let verticalAlign = 'center'
    if (this.verticalAlign == 'top') verticalAlign = 'flex-start'
    if (this.verticalAlign == 'bottom') verticalAlign = 'flex-end'
    return {
      alignItems: verticalAlign,
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
  z-index: 900;
  width: 100vw;

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

.wrap {
  display: flex;
  height: 100%;
  width: 100%;
}

.text-block {
  outline: none;
  width: 100%;
  height: fit-content;
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
