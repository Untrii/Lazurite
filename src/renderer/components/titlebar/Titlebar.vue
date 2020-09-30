<template>
  <div class="titlebar" :style="rootStyle">
    <div class="titlebar__logo">
      <img :src="assets.logo" alt="" v-if="isVisible" />
    </div>
    <div class="titlebar__nav">
      <div
        class="titlebar__nav-item"
        @click="selectTab(tab)"
        @mouseenter="$emit('tab-hovered', tab)"
        @mouseleave="$emit('tab-unhovered', tab)"
        v-for="tab in tabs"
        :key="tab"
      >
        {{ tab }}
      </div>
    </div>
    <div
      class="titlebar__dragzone"
      :class="{ 'titlebar__dragzone-maximized': isMaximized }"
    ></div>
    <div class="titlebar__buttons">
      <div class="titlebar__button" @click="minimize">
        <img :src="assets.minimize" alt="" />
      </div>
      <div class="titlebar__button" @click="minmax">
        <img :src="assets.minmax" alt="" />
      </div>
      <div class="titlebar__button titlebar__button_red" @click="close">
        <img :src="assets.close" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import assets from '@/assets/index'
import Vue from 'vue'
import Component from 'vue-class-component'
import { remote } from 'electron'

@Component
export default class Titlebar extends Vue {
  height = 31
  isVisible = true
  isMaximized = false
  tabs = ['design', 'constructor']

  constructor() {
    super()
  }

  minimize() {
    remote.getCurrentWindow().minimize()
  }

  minmax() {
    const currentWindow = remote.getCurrentWindow()
    if (currentWindow.isMaximized()) {
      currentWindow.unmaximize()
    } else {
      currentWindow.maximize()
    }
  }

  close() {
    remote.app.quit()
  }

  selectTab(tabname) {
    this.$emit('tab-changed', tabname)
  }

  beforeMount() {
    console.log(assets)
    const currentWindow = remote.getCurrentWindow()
    currentWindow.on('enter-full-screen', () => {
      this.height = 0
      this.isVisible = false
    })
    currentWindow.on('leave-full-screen', () => {
      this.height = 31
      this.isVisible = true
    })
    currentWindow.on('maximize', () => {
      this.isMaximized = true
    })
    currentWindow.on('unmaximize', () => {
      this.isMaximized = false
    })
  }

  get rootStyle() {
    let style: any = {
      height: this.height + 'px',
    }
    //if (!this.isVisible) style.display = 'none'
    return style
  }

  get assets() {
    return assets
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/variables.scss';
.titlebar {
  grid-template-columns: min-content max-content auto max-content;
  background-color: $blue-normal;
  width: 100%;
  height: 31px;
  display: grid;

  div {
    height: 100%;
    display: inline-block;
    vertical-align: top;
  }

  &__logo {
    height: 100%;
    transform: scale(0.7);
    img {
      width: 31px;
    }
  }

  &__nav {
    width: fit-content;
  }
  &__nav-item {
    display: inline-flex;
    align-content: center;
    vertical-align: middle;
    color: white;
    padding: 6px;
    font-size: 13px;
    user-select: none;
    cursor: pointer;
    text-transform: capitalize;

    &:hover {
      background-color: $blue-bright;
    }
  }
  &__dragzone {
    -webkit-app-region: drag;
    margin-top: 4px;
    height: 27px;

    &-maximized {
      margin-top: 0px !important;
      height: 31px !important;
    }
  }
  &__buttons {
    width: fit-content;
    display: inline-flex !important;
  }
  &__button {
    width: 46px;
    display: flex !important;
    user-select: none;

    &:hover {
      background-color: $blue-bright;
    }
    &_red:hover {
      background-color: $red-bright;
    }

    img {
      width: 21px;
      align-self: center;
      text-align: center;
      display: block;
      margin: auto;

      transform: scale(0.6);
    }
  }
}
</style>
