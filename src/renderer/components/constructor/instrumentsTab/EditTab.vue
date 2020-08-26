<template>
  <div v-if="isOneElementSelected" class="tab-root">
    <!-- <div v-for="(value, name) in element" :key="name">{{ name }}</div> -->
    <size-editor v-if="isSizeEditorShown"></size-editor>
    <spreadsheet-editor v-if="isSpreadsheetEditorShown"> </spreadsheet-editor>
    <color-correction-editor v-if="isColorCorrectionEditorShown"></color-correction-editor>
    <text-editor v-if="isTextEditorShown"></text-editor>
  </div>
  <div v-else>
    <lz-group-caption>
      Please select one element
    </lz-group-caption>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import EditorService from '@/services/EditorService'
import SizeEditor from './editors/SizeEditor.vue'
import SpreadsheetEditor from './editors/SpreadsheetEditor.vue'
import ColorCorrectionEditor from './editors/ColorCorrectionEditor.vue'
import TextEditor from './editors/TextEditor.vue'

let service = new EditorService()

@Component({
  components: {
    SizeEditor,
    SpreadsheetEditor,
    ColorCorrectionEditor,
    TextEditor,
  },
})
export default class EditTab extends Vue {
  isOneElementSelected: boolean = false
  element: any
  elementType: string = ''
  editableProps: string[] = []

  getState() {
    //this.element = service.
    this.isOneElementSelected = service.isOneElementSelected
    this.element = service.selectedElement
    this.elementType = this.element.type ?? ''
  }

  @Watch('elementType')
  onElementTypeChange() {
    this.editableProps = service.getEditableProperties(this.element.type ?? '')
  }

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    service.addOnChangeListener(this.onChangeListener)
  }
  beforeDestroy() {
    service.removeOnChangeListener(this.onChangeListener)
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
}
</script>

<style lang="scss" scoped></style>
