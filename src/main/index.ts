import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import {
  default as devtools,
  VUEJS_DEVTOOLS,
} from 'electron-devtools-installer'
import * as ImageProcessing from './ImageProcessing'

const isDevelopment = process.env.NODE_ENV !== 'production'

app.on('ready', () => {
  devtools(VUEJS_DEVTOOLS)
    .then((name: any) => console.log(`Added Extension:  ${name}`))
    .catch((err: any) => console.log('An error occurred: ', err))
  let window: BrowserWindow | null = new BrowserWindow({
    width: 1024,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      webviewTag: true,
    },
    frame: false,
  })
  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      })
    )
  }
  window.on('closed', () => {
    window = null
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

export { ImageProcessing }
