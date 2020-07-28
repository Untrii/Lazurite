<template>
  <spreadsheet v-bind="$props"></spreadsheet>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Spreadsheet from '@/components/elements/Spreadsheet.vue'
import Color from '@/entities/Color'

@Component({
  components: { Spreadsheet },
})
export default class RedactableSpreadsheet extends Vue {
  @Prop() id!: number
  @Prop() scale!: number

  @Prop() height!: number
  @Prop() width!: number
  @Prop() rowCount!: number
  @Prop() columnCount!: number
  @Prop() higlitedLines!: string[]
  @Prop() fontSize!: number
  @Prop() content!: Map<number, Map<number, string>>
  @Prop() rowSizes!: number[]
  @Prop() columnSizes!: number[]
  @Prop() parentScale!: number
  @Prop() highlightTop!: boolean
  @Prop() highlightBottom!: boolean
  @Prop() highlightLeft!: boolean
  @Prop() highlightRight!: boolean
  @Prop() stripHorizontally!: boolean
  @Prop() stripVertically!: boolean
  @Prop() darkStyle!: boolean
  @Prop() borderRadius!: number
  @Prop() color!: Color
  @Prop() showBorders!: boolean

  getState() {}

  beforeMount() {
    this.getState()
    //service.addOnChangeListener(() => this.getState())
  }
}
</script>

<style lang="scss" scoped></style>
