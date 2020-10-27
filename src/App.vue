<template>
  <div id="vue">
    <titlebar
      @tab-changed="changeTab"
      @tab-hovered="onTabHover"
      @tab-unhovered="onTabUnhover"
    ></titlebar>
    <div id="app">
      <design-tab class="tab" v-show="openedTab == 'design'"></design-tab>
      <constructor-tab
        class="tab"
        v-show="openedTab == 'constructor'"
      ></constructor-tab>
      <dialogs-wrapper></dialogs-wrapper>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component } from 'vue-property-decorator'
import ConstructorTab from './ConstructorTab.vue'
import DesignTab from './DesignTab.vue'
import Titlebar from './components/titlebar/Titlebar.vue'
import DialogsWrapper from '@/components/dialogs/DialogsWrapper.vue'
import assets from '@/assets'

@Options({
  components: {
    ConstructorTab,
    Titlebar,
    DesignTab,
    DialogsWrapper,
  },
})
export default class App extends Vue {
  openedTab = 'constructor'
  hoveredTab = ''
  lastHovered = ''
  isAnimationStopped = true

  mounted() {
    console.log('loaded')
    console.log(assets)
  }

  changeTab(tabname: string) {
    this.openedTab = tabname
  }

  onTabHover(tab: string) {
    console.log('there')
    this.isAnimationStopped = false
    this.hoveredTab = tab
    this.lastHovered = tab
  }
  onTabUnhover(tab: string) {
    this.lastHovered = tab
    if (this.hoveredTab == tab) this.hoveredTab = ''
  }

  lastStopRequest = new Date()
  get appClasses() {
    const result: string[] = []
    if (this.hoveredTab != '' && this.openedTab != this.hoveredTab)
      result.push(`app__${this.openedTab}-to-${this.hoveredTab}`)
    else if (this.openedTab != this.lastHovered)
      result.push('app__' + this.openedTab + '-back')
    else if (!this.isAnimationStopped) result.push('app__' + this.openedTab)
    else result.push('app__' + this.openedTab + '-no-anim')
    this.lastStopRequest = new Date()
    setTimeout(this.stopAnimation, 1005)
    return result
  }

  stopAnimation() {
    if (new Date().getTime() - this.lastStopRequest.getTime() < 1000) {
      setTimeout(this.stopAnimation, 1005)
      return
    }
    if (this.hoveredTab == '') this.isAnimationStopped = true
  }
}
</script>

<style lang="scss">
@import './css/bootstrap.min.css';
@import './css/variables.scss';
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  // background: #1e1e1e;
  // color: white;
}
#vue {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: min-content auto;
  overflow: hidden;
}
#titlebar {
  height: 31px;
}
#app {
  overflow: hidden;
  position: absolute;
  top: 31px;
  min-width: 100vw;
  height: calc(100vh - 31px);
  display: inline-grid;
  grid-template-columns: 100vw 3vw 100vw;
}
.app__constructor {
  left: -103vw;
  transition: 0.7s;
}
.app__constructor-back {
  left: -103vw;
  transition: 0.2s;
}
.app__constructor-no-anim {
  left: -103vw;
}
.app__design {
  left: 0vw;
  transition: 0.7s;
}
.app__design-back {
  left: 0vw;
  transition: 0.2s;
}
.app__design-no-anim {
  left: 0vw;
}
.app__design-to-constructor {
  left: -13vw;
  transition: 0.2s;
}
.app__constructor-to-design {
  left: -90vw;
  transition: 0.2s;
}
.separator {
  background-color: #212529;
  height: 100%;
  width: 3vw;
}
.tab {
  width: 100vw;
  height: calc(100vh - 31px) !important;
}
::-webkit-scrollbar {
  width: 12px;
}
::-webkit-scrollbar-thumb {
  background: $blue-bright;
  border-color: $gray-extralight;
  border-style: solid;
  border-width: 0px 0px 0px 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: $blue-bright;
  border: solid 2px $gray-extralight;
  border-radius: 10px;
}
</style>
