<template>
  <div class="history">
    <div
      class="history__item history__item_disabled"
      v-for="(item, index) in history.redo"
      @click="onRedoClick(index)"
    >
      {{ item.actionType }}
    </div>
    <div
      class="history__item"
      v-for="(item, index) in history.undo"
      @click="onUndoClick(index)"
    >
      {{ item.actionType }}
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable vue/require-v-for-key */
import { Vue, Component } from 'vue-property-decorator'
import HistoryService from '@/services/HistoryService'
import HistoryDeclarationInfo from '@/entities/history/HistoryDeclarationInfo'

let service = new HistoryService()

@Component
export default class HistoryTab extends Vue {
  history: HistoryDeclarationInfo = {
    redo: [],
    undo: [],
  }
  async getState() {
    this.history = await service.getHistory()

    // this.history.redo = [...history.redo]
    // this.history.undo = [...history.undo]
  }

  beforeMount() {
    console.log('HistoryTab')
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }

  async onUndoClick(index: number | string) {
    if (typeof index == 'string') index = parseInt(index)
    await service.undo(index + 1)
  }
  async onRedoClick(index: number | string) {
    if (typeof index == 'string') index = parseInt(index)
    await service.redo(this.history.redo.length - index)
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
