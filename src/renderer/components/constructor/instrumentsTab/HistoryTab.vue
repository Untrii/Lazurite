<template>
  <div class="history">
    <!-- <div
      class="history__item history__item_disabled"
      v-for="item in history.redo"
      @click="onRedoClick(item.index)"
      :key="item.index"
    >
      {{ item.actionType }}
    </div>
    <div class="history__item" v-for="item in history.undo" @click="onUndoClick(item.index)" :key="item.index">
      {{ item.actionType }}
    </div> -->
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
import { Vue, Component } from 'vue-property-decorator'
import HistoryService from '@/services/HistoryService'
import HistoryDeclarationInfo from '@/entities/history/HistoryDeclarationInfo'
import HistoryRecordInfo from '@/entities/history/HistoryRecordInfo'

let service = new HistoryService()

@Component
export default class HistoryTab extends Vue {
  history: HistoryDeclarationInfo = {
    redo: [],
    undo: [],
  }
  async getState() {
    this.history = await service.getHistory()
  }

  beforeMount() {
    console.log('HistoryTab')
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  getImageFor(index: number, arrayName: string) {
    let arr: HistoryRecordInfo[] = []
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
