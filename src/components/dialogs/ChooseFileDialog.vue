<template>
  <lz-modal :isVisible="isVisible" @close="rejectChoose">
    <div class="dialog__content">
      <div class="row">
        <div
          class="col-md-6 col-lg-4 col-xl-3"
          v-for="file in files"
          :key="file"
        >
          <div class="card dialog__card" @click="createElement(file)">
            <div
              class="card-img-top dialog__card-preview"
              :style="{
                backgroundImage: `url('local-img://${getFullPath(file)}')`,
              }"
            >
              <img
                v-if="isImage(file)"
                :src="getFullPath(file)"
                height="0"
                width="0"
                :id="'selrs' + file"
              />
              <video
                v-if="isVideo(file)"
                :src="getFullPath(file)"
                height="0"
                width="0"
                :id="'selrs' + file"
              ></video>
            </div>
            <div class="card-body">
              <p class="card-text">{{ file }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog__btn-dock">
      <lz-button variant="primary" @click="openFile">Add file</lz-button>
      <lz-button variant="primary" @click="showBrowser"
        >Add file from internet</lz-button
      >
      <lz-button variant="primary" @click="openProjectFolder"
        >Open workspace in explorer</lz-button
      >
      <lz-button variant="primary" @click="reloadFiles">Reload files</lz-button>
    </div>
    <browser v-if="isBrowserOpened" @closed="onBrowserClosed"></browser>
  </lz-modal>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import DialogService from '@/services/DialogService'
import Browser from './Browser.vue'
import { promises as fs } from 'fs'
import { Buffer } from 'buffer'
import { shell, remote } from 'electron'
import ConstrctorStore from '@/services/store/ConstructorStore'
import ResourceSercvice from '@/services/constructor/ResourceService'
import RuntimeRepository from '@/repositories/RuntimeRepository'
import { Watch } from 'vue-property-decorator'
const dialog = remote.dialog

const dialogService = new DialogService()
const store = new ConstrctorStore()
const resourceService = new ResourceSercvice()
const runtimeData = RuntimeRepository.Instance.data
let isDialogShown = false

@Options({
  components: {
    Browser,
  },
})
export default class ChooseFileDialog extends Vue {
  files: string[] = []
  isBrowserOpened = false

  async beforeMount() {
    await this.reloadFiles()
  }

  get isVisible() {
    return dialogService.isChooseFileDialogOpened
  }

  @Watch('isVisible')
  onVisibilityChanged() {
    this.files = []
    this.reloadFiles()
  }

  getFullPath(fileName: string) {
    return store.resourceFolder + '/' + fileName
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
    //this.$bvModal.hide('choseFileDialog')
  }

  async openFile() {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
    })
    if (!result.canceled) {
      for (const file of result.filePaths) {
        await resourceService.addResourceFile(file)
      }
      this.reloadFiles()
    }
  }
  showBrowser() {
    this.isBrowserOpened = true
  }
  openProjectFolder() {
    throw new Error('Not implemented')
    //shell.openItem(store.resourceFolder)
  }
  async reloadFiles() {
    this.files = await resourceService.getFiles(runtimeData.dialogType)
  }

  rejectChoose() {
    dialogService.onChooseRejected()
  }

  async onBrowserClosed(data) {
    const start = new Date()

    for (const key in data) {
      const d = data[key].split(',')
      const format = d[0].replace('data:image/', '').replace(';base64', '')

      const dataArr = new Buffer(d[1], 'base64')

      await fs.writeFile(
        store.resourceFolder + '/' + key + '.' + format,
        dataArr
      )
    }

    this.isBrowserOpened = false
    this.reloadFiles()
    console.log(
      'Saved images in:' + (new Date().getTime() - start.getTime()) + 'ms'
    )
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  &__content {
    width: 1200px;
    max-width: calc(100vw - 360px);
    float: left;
    max-height: calc(100vh - 320px);
    overflow-y: scroll;
    overflow-x: hidden;
    height: calc(100vh - 320px);
    max-height: 720px;
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
    div {
      margin-bottom: 10px;
    }
  }
}
</style>
