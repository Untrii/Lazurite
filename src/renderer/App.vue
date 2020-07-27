<template>
  <div id="vue">
    <titlebar @tabChanged="changeTab"></titlebar>
    <div id="app">
      <constructor-tab v-if="openedTab == 'constructor'"></constructor-tab>
      <design-tab v-if="openedTab == 'design'"></design-tab>
      <dialogs-wrapper></dialogs-wrapper>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ConstructorTab from './ConstructorTab.vue'
import DesignTab from './DesignTab.vue'
import Titlebar from './components/titlebar/Titlebar.vue'
import DialogsWrapper from '@/components/dialogs/DialogsWrapper.vue'

@Component({
  components: {
    ConstructorTab,
    Titlebar,
    DesignTab,
    DialogsWrapper,
  },
})
export default class App extends Vue {
  openedTab = 'constructor'

  mounted() {
    console.log('loaded')
  }

  changeTab(tabname: string) {
    this.openedTab = tabname
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
}
#vue {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: min-content auto;
}
#titlebar {
  height: 31px;
}
#app {
  overflow: hidden;
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
