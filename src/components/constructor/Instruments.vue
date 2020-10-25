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
      <edit-tab v-show="selectedTab == 'edit'"></edit-tab>
      <history-tab v-if="selectedTab == 'history'"></history-tab>
      <layers-tab v-if="selectedTab == 'layers'"></layers-tab>
      <slide-settings-tab v-if="selectedTab == 'editorSettings'"></slide-settings-tab>
    </div>
    <div class="bottom-buttons">
      <lz-button :blockLevel="true" image="logo" size="medium" variant="secondary" image-position="right">
        Launch from the start
      </lz-button>
      <lz-button
        :blockLevel="true"
        image="logo"
        size="medium"
        variant="primary"
        image-position="right"
        @click="$emit('demonstration-started')"
      >
        Launch from this slide
      </lz-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import assets from '@/assets/index'
import AddTab from './instrumentsTab/AddTab.vue'
import EditTab from './instrumentsTab/EditTab.vue'
import HistoryTab from './instrumentsTab/HistoryTab.vue'
import SlideSettingsTab from './instrumentsTab/SlideSettingsTab.vue'
import LayersTab from './instrumentsTab/LayersTab.vue'

import ConstructorStore from '@/services/store/ConstructorStore'
import { Watch } from 'vue-property-decorator'

const store = new ConstructorStore()

@Options({
  components: {
    AddTab,
    EditTab,
    HistoryTab,
    SlideSettingsTab,
    LayersTab,
  },
})
export default class Instruments extends Vue {
  selectedTab = 'add'
  availableTabs = [
    {
      name: 'add',
      icon: assets.add,
    },
    {
      name: 'edit',
      icon: assets.switch,
    },
    {
      name: 'history',
      icon: assets.history,
    },
    {
      name: 'layers',
      icon: assets.layers,
    },
    {
      name: 'editorSettings',
      icon: assets.gear,
    },
  ]

  get selectedElementsCount() {
    return store.selectedObjectIds.length
  }

  @Watch('selectedElementsCount')
  onSelectionChanged(value, oldValue) {
    if (oldValue == 0 && value > 0) {
      this.selectedTab = 'edit'
    } else if (oldValue > 0 && value == 0) {
      this.selectedTab = 'add'
    }
  }
}
</script>

<style lang="scss" scoped>
.instruments {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  display: grid;
  grid-template-rows: 40px 1fr 104px;
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
