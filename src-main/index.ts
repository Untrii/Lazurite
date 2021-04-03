import { app, BrowserWindow } from 'electron'
import { is } from 'electron-util'
import { createSafeFileProtocol, createFontPreviewProtocol } from './protocols'

function loadRoute(window, route) {
  let url

  if (is.development) {
    url = `http://localhost:3535/`
  } else {
    url = `file:///${app.getAppPath()}/index.html#${route}`
  }

  window.loadURL(url)
}

// Prevent window being garbage collected
let mainWindow

function createMainWindow() {
  let newMainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      webviewTag: true,
      enableRemoteModule: true,
    },

    frame: false,
  })

  newMainWindow.on('closed', () => {
    newMainWindow = null
  })

  loadRoute(newMainWindow, '')
  mainWindow = newMainWindow
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  createMainWindow()
  createSafeFileProtocol('local')
  createFontPreviewProtocol()
})
