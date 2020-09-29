<template>
  <div class="tabRoot">
    <div class="menu">
      <div
        class="menu__button"
        :class="{ menu__button_selected: selectedTab == 'background' }"
        @click="selectedTab = 'background'"
      >
        {{ localize('background') }}
      </div>
      <div
        class="menu__button"
        :class="{ menu__button_selected: selectedTab == 'color' }"
        @click="selectedTab = 'color'"
      >
        {{ localize('color') }}
      </div>
      <div
        class="menu__button"
        :class="{ menu__button_selected: selectedTab == 'typography' }"
        @click="selectedTab = 'typography'"
      >
        {{ localize('typography') }}
      </div>
    </div>
    <div class="main-content">
      <background-module v-if="selectedTab == 'background'" />
      <typography-module v-if="selectedTab == 'typography'" />
      <color-module v-if="selectedTab == 'color'" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import BackgroundModule from './components/design/BackgroundModule.vue'
import ColorModule from './components/design/ColorModule.vue'
import TypographyModule from './components/design/TypographyModule.vue'
import localize from './utils/locales'
import DesignService from './services/DesignService'

const service = new DesignService()

@Component({
  components: {
    BackgroundModule,
    ColorModule,
    TypographyModule,
  },
})
export default class DesignTab extends Vue {
  selectedTab: string = 'background'

  beforeMount() {
    this.selectedTab = service.openedTab
  }

  @Watch('selectedTab')
  updateTab() {
    service.openedTab = this.selectedTab
  }

  localize(str) {
    return localize('en', str)
  }
}
</script>

<style lang="scss" scoped>
@import './css/variables.scss';
.tabRoot {
  width: 100%;
  height: 100%;
  display: inline-grid;
  grid-template-columns: 240px auto;
  grid-template-rows: 100%;
  background: $gray-extralight;
}

.menu {
  display: inline-block;
  top: 31px;
  left: 0;
  height: 100%;
  background: #1a2c3e;
  color: white;
  font-weight: 500;
  font-size: 20px;
  width: 240px;

  &__button {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;

    &:hover {
      background: $blue-semidark;
    }
    &_selected {
      border-left: 5px solid white;
      width: calc(100% - 5px);
    }
  }
}

.main-content {
  display: inline-block;
}

.main-content::-webkit-scrollbar-thumb {
  border-color: $gray-extralight;
}

.section-header {
  height: 120px;
  display: flex;
  align-items: center;
  width: 100%;
}
.sh-selected {
  text-decoration: underline;
}
.sh-title {
  margin: 0 40px;
  display: inline;
}
.sh-item {
  cursor: pointer;
  display: inline;
  margin: 20px;
}
.sf-item-wrap {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.hidden {
  opacity: 0;
}
.visible {
  opacity: 1 !important;
  transition: 0.5s;
}
.visiblef {
  opacity: 1 !important;
}
.presentation-name-input {
  float: right;
  max-width: 600px;
}
.presentation-create-btn {
  float: right;
  margin-left: 50px;
}
.creation-wrap {
  margin: 50px 100px 50px 0;
  height: 46px;
}
</style>
