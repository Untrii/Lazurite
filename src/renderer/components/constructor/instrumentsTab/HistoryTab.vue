<template>
  <div class="history">
    <div class="history__item">
      history item
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import HistoryService from '@/services/HistoryService'

let service = new HistoryService()

@Component
export default class HistoryTab extends Vue {
  getState() {}

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.history {
  background: $red-bright;
  min-height: 100%;
  &__item {
    width: 100%;
    height: 40px;
    padding: 8px;
  }
}
</style>
