<template>
  <b-modal centered id="choseFileDialog" title="Project files" size="xl">
    <div class="dialog__content">
      <div class="row">
        <div
          class="col-md-6 col-lg-4 col-xl-3"
          v-for="file in files"
          :key="file"
        >
          <div class="card file-card" @click="createElement(file)">
            <div
              class="card-img-top file-preview"
              :style="{ backgroundImage: `url('${file}')` }"
            >
              <img
                v-if="dialogElementType.startsWith('localImage')"
                :src="file"
                height="0"
                width="0"
                :id="'selrs' + file"
              />
              <video
                v-if="dialogElementType.startsWith('localVideo')"
                :src="file"
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
    <div class="dialog-btn-dock">
      <b-button block variant="primary" @click="openFile">Add file</b-button>
      <b-button block variant="primary" @click="showBrowser"
        >Add file from internet</b-button
      >
      <b-button block variant="primary" @click="openProjectFolder"
        >Open workspace in explorer</b-button
      >
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import DialogService from '@/services/DialogService'
import ResourceService from '@/services/ResourceService'

let dialogService = new DialogService()
let resourceService = new ResourceService()

@Component
export default class ChooseFileDialog extends Vue {
  files: string[] = []

  async getState() {
    if (dialogService.isChooseFileDialogOpened)
      this.$bvModal.show('choseFileDialog')
    else this.$bvModal.hide('choseFileDialog')
    this.files = await resourceService.getResourceFiles(
      dialogService.chooseFileDialogType
    )
  }

  beforeMount() {
    console.log('Dialog')
    this.getState()
    dialogService.addOnChangeListener(() => this.getState())
  }

  createElement(fileName: string) {}

  openFile() {}
  showBrowser() {}
  openProjectFolder() {}
}
</script>

<style lang="scss" scoped>
.dialog {
  &__content {
    width: calc(100% - 220px);
    float: left;
    max-height: calc(100vh - 320px);
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
