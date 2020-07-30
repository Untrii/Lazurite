<template>
  <div class="root">
    <div class="browser-navbar">
      <div class="browser-navbar__button" @click="back">
        <img :src="assets.left_arrow" />
      </div>
      <div class="browser-navbar__button" @click="forward">
        <img :src="assets.right_arrow" />
      </div>
      <div class="browser-navbar__button" @click="refresh">
        <img :src="assets.refresh" />
      </div>

      <div
        class="browser-navbar__button browser-navbar__button_wide"
        style="margin-left: 40px;"
        @click="currentURL = availableURLs[0]"
      >
        <span>
          <span style="color: #4285f4;">G</span>
          <span style="color: #ea4335;">o</span>
          <span style="color: #fbbc05;">o</span>
          <span style="color: #4285f4;">g</span>
          <span style="color: #34a853;">l</span>
          <span style="color: #ea4335;">e</span>
        </span>
      </div>
      <div
        class="browser-navbar__button browser-navbar__button_wide"
        @click="currentURL = availableURLs[1]"
      >
        <span>
          <span style="color: red;">Y</span>
          <span style="color: black;">andex</span>
        </span>
      </div>

      <div
        class="browser-navbar__button browser-navbar__button_wide"
        style="margin-left: 40px; cursor: auto;"
      >
        <span>
          Files downloaded: {{ savedFilesCount }}
          <span style="color: gray;">(click RMB to download)</span></span
        >
      </div>

      <div
        class="browser-navbar__button"
        id="close-button"
        @click="$emit('closed', savedData)"
      >
        Close browser
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import assets from '@/assets'

import { remote, ipcRenderer } from 'electron'
const { BrowserView, BrowserWindow } = remote

let view

@Component
export default class Browser extends Vue {
  savedData: any = {}
  savedFilesCount = 0

  currentURL = 'https://www.google.ru/imghp?hl=en'
  availableURLs = [
    'https://www.google.ru/imghp',
    'https://yandex.ru/images/',
    'https://www.bing.com/?scope=images',
    'https://images.search.yahoo.com/',
  ]
  getState() {}

  beforeMount() {
    this.getState()
    //service.addOnChangeListener(() => this.getState())
  }

  async mounted() {
    let windowID = remote.getCurrentWindow().id
    let justCreated = false
    let win = BrowserWindow.fromId(windowID)
    if (!view) {
      let preloadPath =
        process
          .cwd()
          .split('\\')
          .join('/') + '/src/browserPreload.js'

      view = new BrowserView({
        webPreferences: {
          webSecurity: false,
          preload: preloadPath,
        },
      })
      ipcRenderer.on('imgdata', (event, message) => {
        this.savedData[new Date().getTime()] = message
        this.savedFilesCount++
      })
      win.setBrowserView(view)
      justCreated = true
    }
    view.setBounds({
      x: 0,
      y: 67,
      width: window.innerWidth,
      height: window.innerHeight - 67,
    })
    view.webContents.loadURL(this.currentURL)
    view.webContents.on('dom-ready', async () => {
      if (justCreated) {
        await view.webContents.executeJavaScript(
          'lzsubcode(' + win.webContents.id + ')'
        )
      }
    })
  }

  beforeDestroy() {
    let windowID = remote.getCurrentWindow().id
    let win = BrowserWindow.fromId(windowID)
    win.removeBrowserView(view)
    view.destroy()
    view = undefined

    ipcRenderer.removeAllListeners('imgdata')
  }

  @Watch('currentUrl')
  changeUrl(val) {
    if (view) view.webContents.loadURL(val)
  }

  get assets() {
    return assets
  }

  back() {
    view.webContents.goBack()
  }
  forward() {
    view.webContents.goForward()
  }
  refresh() {
    view.webContents.reload()
  }
}
</script>

<style lang="scss" scoped>
.root {
  position: fixed;
  top: 31px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 31px);
  background: white;
}
.browser-navbar {
  height: 36px;
  background: #f5f5fa;

  &__button {
    height: 36px;
    width: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: space-around;
    vertical-align: middle;

    * {
      position: relative;
    }
    img {
      width: 16px;
      height: 16px;
    }

    &_wide {
      font-weight: 500;
      font-size: 14px;
      width: fit-content;
      margin: 0 10px;
      cursor: pointer;
    }
  }
}

.content {
  width: 100%;
  height: calc(100% - 36px);
  border: 0;
  padding: 0;
}

#close-button {
  width: 150px;
  float: right;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}
</style>
