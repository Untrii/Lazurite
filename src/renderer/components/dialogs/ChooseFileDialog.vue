<template>
  <b-modal centered id="choseFileDialog" title="Project files" size="xl" @close="rejectChoose">
    <div class="dialog__content">
      <div class="row">
        <div class="col-md-6 col-lg-4 col-xl-3" v-for="file in files" :key="file">
          <div class="card dialog__card" @click="createElement(file)">
            <div class="card-img-top dialog__card-preview" :style="{ backgroundImage: `url('${getFullPath(file)}')` }">
              <img v-if="isImage(file)" :src="getFullPath(file)" height="0" width="0" :id="'selrs' + file" />
              <video v-if="isVideo(file)" :src="getFullPath(file)" height="0" width="0" :id="'selrs' + file"></video>
            </div>
            <div class="card-body">
              <p class="card-text">{{ file }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog__btn-dock">
      <b-button block variant="primary" @click="openFile">Add file</b-button>
      <b-button block variant="primary" @click="showBrowser">Add file from internet</b-button>
      <b-button block variant="primary" @click="openProjectFolder">Open workspace in explorer</b-button>
      <b-button block variant="primary" @click="reloadFiles">Reload files</b-button>
    </div>
    <browser v-if="isBrowserOpened" @closed="onBrowserClosed"></browser>
  </b-modal>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import DialogService from '@/services/DialogService'
import ResourceService from '@/services/ResourceService'
import Browser from './Browser.vue'
import { promises as fs } from 'fs'
import { Buffer } from 'buffer'
import { shell, remote } from 'electron'
const dialog = remote.dialog

let dialogService = new DialogService()
let resourceService = new ResourceService()
let isDialogShown = false

@Component({
  components: {
    Browser,
  },
})
export default class ChooseFileDialog extends Vue {
  files: string[] = []
  isBrowserOpened = false

  async getState() {
    if (dialogService.isChooseFileDialogOpened && !isDialogShown) {
      this.files = await resourceService.getResourceFiles(dialogService.chooseFileDialogType)
      this.$bvModal.show('choseFileDialog')
      isDialogShown = true
    } else if (!dialogService.isChooseFileDialogOpened && isDialogShown) {
      this.$bvModal.hide('choseFileDialog')
      isDialogShown = false
    }
  }

  onChangeListener: Function = () => this.getState()
  beforeMount() {
    this.getState()
    dialogService.addOnChangeListener(this.onChangeListener)
  }
  beforeDestroy() {
    dialogService.removeOnChangeListener(this.onChangeListener)
  }

  getFullPath(fileName: string) {
    return resourceService.resourceFolder + '/' + fileName
  }

  isImage(fileName: string) {
    if (fileName.endsWith('.jpg') || fileName.endsWith('.png')) return true
    return false
  }

  isVideo(fileName: string) {
    if (fileName.endsWith('.mp4')) return true
    return false
  }

  createElement(fileName: string) {
    dialogService.onFileChosen(fileName)
    this.$bvModal.hide('choseFileDialog')
  }

  async openFile() {
    let result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
    })
    if (!result.canceled) {
      for (const file of result.filePaths) {
        await resourceService.addResourceFile(file)
      }
    }
  }
  showBrowser() {
    this.isBrowserOpened = true
  }
  openProjectFolder() {
    shell.openItem(resourceService.resourceFolder)
  }
  reloadFiles() {
    this.getState()
  }

  rejectChoose() {
    dialogService.onChooseRejected()
  }

  async onBrowserClosed(data) {
    let start = new Date()

    for (const key in data) {
      let d = data[key].split(',')
      let format = d[0].replace('data:image/', '').replace(';base64', '')

      let dataArr = new Buffer(d[1], 'base64')

      await fs.writeFile(resourceService.resourceFolder + '/' + key + '.' + format, dataArr)
    }

    this.isBrowserOpened = false
    this.reloadFiles()
    console.log('Saved images in:' + (new Date().getTime() - start.getTime()) + 'ms')
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  &__content {
    width: calc(100% - 230px);
    float: left;
    max-height: calc(100vh - 320px);
    overflow-y: scroll;
    overflow-x: hidden;
  }

  &__card {
    margin-bottom: 20px;
    cursor: pointer;
  }

  &__card-preview {
    height: 160px;
    overflow: hidden;
    background-size: cover;
    background-position: center;
  }

  &__btn-dock {
    min-width: 200px;
    float: right;
    min-height: 1px;
  }
}
</style>
