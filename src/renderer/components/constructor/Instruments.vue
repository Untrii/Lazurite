<template>
  <div class="instruments">
    <div class="tab-buttons">
      <div
        class="tab-buttons__item"
        v-for="tab of availableTabs"
        :key="tab.name"
        @click="selectedTab = tab.name"
        :class="{ 'tab-buttons__item_selected': selectedTab == tab.name }"
      >
        <img :src="tab.icon" alt="" />
      </div>
    </div>
    <div class="main">
      <add-tab v-if="selectedTab == 'add'"></add-tab>
      <edit-tab v-if="selectedTab == 'edit'"></edit-tab>
      <history-tab v-if="selectedTab == 'history'"></history-tab>
      <slide-settings-tab v-if="selectedTab == 'editorSettings'"></slide-settings-tab>
    </div>
    <div class="bottom-buttons"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ConstructorService from '@/services/ConstructorService'
import assets from '@/assets/index'
import AddTab from './instrumentsTab/AddTab.vue'
import EditTab from './instrumentsTab/EditTab.vue'
import HistoryTab from './instrumentsTab/HistoryTab.vue'
import SlideSettingsTab from './instrumentsTab/SlideSettingsTab.vue'

let service = new ConstructorService()

@Component({
  components: {
    AddTab,
    EditTab,
    HistoryTab,
    SlideSettingsTab,
  },
})
export default class Instruments extends Vue {
  selectedTab = 'add'
  availableTabs = [
    {
      name: 'add',
      icon: assets.plusblue,
    },
    {
      name: 'edit',
      icon: assets.spark,
    },
    {
      name: 'history',
      icon: assets.refresh,
    },
    {
      name: 'layers',
      icon: assets.spark,
    },
    {
      name: 'editorSettings',
      icon: assets.spark,
    },
  ]
  getState() {}

  beforeMount() {
    this.getState()
    service.addOnChangeListener(() => this.getState())
  }
}
</script>

<style lang="scss" scoped>
.instruments {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  display: grid;
  grid-template-rows: 40px 1fr 100px;
  background-color: #f5f5fa;
}
.tab-buttons {
  width: 100%;
  background-color: #e6e6eb;

  &__item {
    cursor: pointer;
    user-select: none;
    -webkit-user-drag: none;
    display: inline-flex;
    align-items: center;
    width: 20%;
    height: 40px;
    background-color: #e6e6eb;

    img {
      margin: auto;
      height: 21px;
      width: 21px;
    }

    &_selected {
      background-color: #f5f5fa;
    }
  }
}

.main {
  overflow-y: scroll;
}

.bottom-buttons {
  height: 100px;
  width: 100%;
  background-color: #e6e6eb;
}
</style>
