<template>
  <div v-if="isOneElementSelected">
    <!-- <div v-for="(value, name) in element" :key="name">{{ name }}</div> -->
    <size-editor v-if="isSizeEditorShown"></size-editor>
  </div>
  <div v-else>
    Please select one element.
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import EditorService from '@/services/EditorService'
import SizeEditor from './editors/SizeEditor.vue'

let service = new EditorService()

@Component({
  components: {
    SizeEditor,
  },
})
export default class EditTab extends Vue {
  isOneElementSelected: boolean = false
  element: any
  editableProps: string[] = []

  getState() {
    //this.element = service.
    this.isOneElementSelected = service.isOneElementSelected
    this.element = service.selectedElement
    this.editableProps = service.getEditableProperties(this.element.type ?? '')
  }

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
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
    return this.element.type == 'Spreadsheet'
  }
}
</script>

<style lang="scss" scoped></style>
