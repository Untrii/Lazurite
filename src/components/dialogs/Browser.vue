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
        <span style="display:inline-flex;">
          <span style="color: #4285f4;">G</span>
          <span style="color: #ea4335;">o</span>
          <span style="color: #fbbc05;">o</span>
          <span style="color: #4285f4;">g</span>
          <span style="color: #34a853;">l</span>
          <span style="color: #ea4335;">e</span>
        </span>
      </div>
      <div class="browser-navbar__button browser-navbar__button_wide" @click="currentURL = availableURLs[1]">
        <span style="display:inline-flex;">
          <span style="color: red;">Y</span>
          <span style="color: black;">andex</span>
        </span>
      </div>

      <div class="browser-navbar__lettering" style="margin-left: 40px; cursor: auto;">
        <span> Files downloaded: {{ savedFilesCount }} <span style="color: gray;">(click RMB to download)</span></span>
      </div>

      <div class="browser-navbar__button" id="close-button" @click="closeBrowser">
        Close browser
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch } from 'vue-property-decorator'
import { Vue } from 'vue-class-component'
import assets from '@/assets'

import { remote, ipcRenderer } from 'electron'
const { BrowserView, BrowserWindow } = remote

let view

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

  async mounted() {
    const windowID = remote.getCurrentWindow().id
    let justCreated = false
    const win = BrowserWindow.fromId(windowID)
    if (!view) {
      const preloadPath =
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
        await view.webContents.executeJavaScript('lzsubcode(' + win.webContents.id + ')')
      }
    })

    window.addEventListener('resize', this.onWindowResize)
  }

  closeBrowser() {
    this.$emit('closed', this.savedData)
    const windowID = remote.getCurrentWindow().id
    const win = BrowserWindow.fromId(windowID)
    win.removeBrowserView(view)
    view.destroy()
    view = undefined

    ipcRenderer.removeAllListeners('imgdata')
    window.removeEventListener('resize', this.onWindowResize)
  }

  onWindowResize() {
    if (view)
      view.setBounds({
        x: 0,
        y: 67,
        width: window.innerWidth,
        height: window.innerHeight - 67,
      })
  }

  @Watch('currentURL')
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
@import '@/css/variables.scss';

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
  background: $gray-extralight;

  &__lettering {
    display: inline-flex;
    align-items: center;
    justify-content: space-around;
    vertical-align: middle;
    font-weight: 500;
    font-size: 14px;
    margin: 0 10px;
  }

  &__button {
    height: 36px;
    width: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: space-around;
    vertical-align: middle;

    &:hover {
      background-color: $gray-light;
      // border-radius: 16px;
      // border: 4px solid $gray-extralight;
    }

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
      padding: 0 10px;
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
