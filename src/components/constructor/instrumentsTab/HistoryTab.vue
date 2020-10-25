<template>
  <div class="history">
    <lz-button
      v-for="item in history.redo"
      @click="onRedoClick(item.index)"
      :key="'redo' + item.index"
      :disabled="true"
      :image="item.icon"
      variant="transparent"
      size="small"
      >{{ item.actionType }}</lz-button
    >
    <lz-button
      v-for="item in history.undo"
      @click="onUndoClick(item.index)"
      :key="'undo' + item.index"
      :image="item.icon"
      variant="transparent"
      size="small"
      >{{ item.actionType }}</lz-button
    >
  </div>
</template>

<script lang="ts">
/* eslint-disable-file no-use-before-define */
// eslint-disable vue/require-v-for-key
import { Vue } from 'vue-class-component'
import IHistoryDeclarationInfo from '@/entities/history/IHistoryDeclarationInfo'
import IHistoryRecordInfo from '@/entities/history/IHistoryRecordInfo'
import HistoryService from '@/services/constructor/HistoryService'

const service = new HistoryService()

export default class HistoryTab extends Vue {
  get history(): IHistoryDeclarationInfo {
    return service.getHistory()
  }

  getImageFor(index: number, arrayName: string) {
    let arr: IHistoryRecordInfo[] = []
    if (arrayName == 'undo') arr = this.history.undo
    else arr = this.history.redo
    return arr[index].icon
  }

  async onUndoClick(index: number | string) {
    if (typeof index == 'string') index = parseInt(index)
    await service.undo(index + 1)
  }
  async onRedoClick(index: number | string) {
    if (typeof index == 'string') index = parseInt(index)
    await service.redo(this.history.redo.length - index)
  }

  get k() {
    return new Date().getTime().toString()
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.history {
  min-height: 100%;
  &__item {
    width: 100%;
    height: 40px;
    padding: 8px;
    cursor: pointer;
    user-select: none;
    &_disabled {
      color: gray;
    }
  }
}
</style>
