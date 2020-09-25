<template>
  <table :style="style" class="table">
    <tr v-for="(row, rowIndex) in content" :key="'row-' + rowIndex" :style="rowStyle(rowIndex)" class="table__row">
      <td
        v-for="(cell, cellIndex) in row"
        :key="'cell-' + id + '-' + rowIndex + '-' + cellIndex"
        :id="'cell-' + id + '-' + rowIndex + '-' + cellIndex"
        :style="cellStyle(cellIndex, rowIndex)"
        class="table__cell"
      >
        <div class="table__cell-content" v-html="content[rowIndex][cellIndex]"></div>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Color from '@/entities/Color'

@Component
export default class Spreadsheet extends Vue {
  @Prop() id!: number
  @Prop() scale!: number

  @Prop() height!: number
  @Prop() width!: number
  @Prop() rowCount!: number
  @Prop() columnCount!: number
  @Prop() higlitedLines!: string[]
  @Prop() fontSize!: number
  @Prop() content!: string[][]
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
  @Prop({ default: () => new Color() }) color!: Color
  @Prop() showBorders!: boolean

  get style() {
    return {
      fontSize: this.fontSize + 'px',
      backgroundColor: this.darkStyle ? '#32383E' : 'white',
      color: this.darkStyle ? 'white' : '#212529',
      // border: this.darkStyle
      //   ? 2 * this.parentScale + 'px solid black'
      //   : 2 * this.parentScale + 'px solid white',
      borderRadius: this.parentScale * this.borderRadius + 'px',
    }
  }

  get headerColor(): string {
    let color = new Color()
    color.fromOther(this.color)
    if (this.darkStyle) {
      if (color.r + color.g + color.b > 300) {
        color.r -= 30
        color.g -= 30
        color.b -= 30
      }
    } else {
      if (color.r + color.g + color.b < 300) color.a = 0.8
    }
    return color.toCssColor()
  }

  get rowColor(): string {
    let color = new Color()
    color.fromOther(this.color)
    color.a = 0.2
    return this.darkStyle ? '#212529' : color.toCssColor()
  }

  get stripColor(): string {
    let color = new Color()
    color.fromOther(this.color)
    color.a = 0.5
    return this.darkStyle ? '#2C3034' : color.toCssColor()
  }

  rowStyle(index: number) {
    return {
      height: this.rowSizes[index] * 100 + '%',
    }
  }

  cellStyle(index: number, rowIndex: number) {
    let res: any = {
      width: this.columnSizes[index] * 100 + '%',
    }

    res.backgroundColor = this.rowColor

    if (this.stripHorizontally && rowIndex % 2 == 1) res.backgroundColor = this.stripColor
    if (this.stripVertically && index % 2 == 1) res.backgroundColor = this.stripColor

    if (rowIndex == 0 && this.highlightTop) res.backgroundColor = this.headerColor
    if (rowIndex == this.rowCount - 1 && this.highlightBottom) res.backgroundColor = this.headerColor

    if (index == 0 && this.highlightLeft) res.backgroundColor = this.headerColor
    if (index == this.columnCount - 1 && this.highlightRight) res.backgroundColor = this.headerColor

    //Borders
    if (this.borderRadius != 0) {
      if (index == 0 && rowIndex == 0) res.borderTopLeftRadius = this.parentScale * (this.borderRadius - 1) + 'px'
      if (index == 0 && rowIndex == this.rowCount - 1)
        res.borderBottomLeftRadius = this.parentScale * (this.borderRadius - 1) + 'px'

      if (index == this.columnCount - 1 && rowIndex == 0)
        res.borderTopRightRadius = this.parentScale * (this.borderRadius - 1) + 'px'
      if (index == this.columnCount - 1 && rowIndex == this.rowCount - 1)
        res.borderBottomRightRadius = this.parentScale * (this.borderRadius - 1) + 'px'
    }

    if (this.showBorders) {
      res.border = Math.max(1, Math.round(3 * this.parentScale)) + 'px solid ' + (this.darkStyle ? '#32383E' : 'white')
    }

    return res
  }

  // getContent(rowIndex: number, cellIndex: number) {
  //   let row = this.content.get(rowIndex)
  //   if (row) {
  //     let cell = row.get(cellIndex)
  //     if (cell) return cell
  //   }
  //   return ''
  // }

  // get contentAsArray(): string[][] {
  //   let result: string[][] = []
  //   for (let i = 0; i < this.rowCount; i++) {
  //     result.push([])
  //     result[i].push('')
  //   }
  //   for (const key of this.content.keys()) {
  //     let row = this.content.get(key)
  //     if (row)
  //       for (const columnKey of row.keys()) {
  //         result[key][columnKey] = this.content?.get(key)?.get(columnKey) ?? ''
  //       }
  //   }
  //   return result
  // }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  height: 100%;

  &__row {
    width: 100%;
    margin: 0;
  }
  &__cell {
    border-collapse: collapse;
    padding: 0;
  }
  &__cell-content {
    width: 100%;
    height: 100%;
  }
}
</style>
