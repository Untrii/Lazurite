<template>
  <div v-if="isOneElementSelected" class="tab-root">
    <!-- <div v-for="(value, name) in element" :key="name">{{ name }}</div> -->
    <size-editor v-if="isSizeEditorShown"></size-editor>
    <spreadsheet-editor v-if="isSpreadsheetEditorShown"> </spreadsheet-editor>
    <color-correction-editor v-if="isColorCorrectionEditorShown"></color-correction-editor>
    <text-editor v-if="isTextEditorShown"></text-editor>
    <figure-editor v-if="isFigureEditorShowm"></figure-editor>
  </div>
  <div v-else>
    <lz-group-caption>
      Please select one element
    </lz-group-caption>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import SizeEditor from './editors/SizeEditor.vue'
import SpreadsheetEditor from './editors/SpreadsheetEditor.vue'
import ColorCorrectionEditor from './editors/ColorCorrectionEditor.vue'
import TextEditor from './editors/TextEditor.vue'
import FigureEditor from './editors/FigureEditor.vue'
import ConstrctorStore from '@/services/store/ConstructorStore'

const store = new ConstrctorStore()

@Options({
  components: {
    SizeEditor,
    SpreadsheetEditor,
    ColorCorrectionEditor,
    TextEditor,
    FigureEditor,
  },
})
export default class EditTab extends Vue {
  get isOneElementSelected(): boolean {
    return store.isOneElementSelected
  }
  get element() {
    return store.selectedElement
  }
  get elementType() {
    return this.element.type ?? ''
  }
  editableProps: string[] = []

  @Watch('elementType')
  onElementTypeChange() {
    this.editableProps = store.getEditableProperties(this.element.type ?? '')
  }

  getEditorType(propertyName) {
    switch (propertyName) {
    }
  }

  isPropertiesExists(props: string[]) {
    for (const key of props) {
      if (this.editableProps.includes(key)) return true
    }
    return false
  }

  get isSizeEditorShown() {
    return this.isPropertiesExists(['top', 'left', 'width', 'height'])
  }

  get isColorCorrectionEditorShown() {
    return this.isPropertiesExists([
      'blur',
      'brightness',
      'contrast',
      'grayscale',
      'hueRotate',
      'opacity',
      'saturate',
      'sepia',
      'dropShadow',
    ])
  }

  get isSpreadsheetEditorShown() {
    return this.elementType == 'Spreadsheet'
  }

  get isTextEditorShown() {
    return this.elementType == 'TextBlock'
  }

  get isFigureEditorShowm() {
    switch (this.elementType) {
      case 'Rectangle':
      case 'EllipseBlock':
      case 'Star':
        return true
      default:
        return false
    }
  }
}
</script>

<style lang="scss" scoped></style>
