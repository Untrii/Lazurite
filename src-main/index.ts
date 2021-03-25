import { app, protocol, BrowserWindow } from 'electron'
import { is } from 'electron-util'
import path from 'path'
import { promises as fs, existsSync } from 'fs'
import crypto from 'crypto'
import createFontPreview from './createFontPreview'

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

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'local',
    privileges: {
      supportFetchAPI: true,
      bypassCSP: true,
      secure: true,
    },
  },
  {
    scheme: 'font-preview',
    privileges: {
      supportFetchAPI: true,
      bypassCSP: true,
      secure: true,
    },
  },
])

function createSafeFileProtocol(protocolName) {
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, '')
    try {
      return callback(decodeURIComponent(url))
    } catch (error) {
      return null
    }
  })
}

async function createFontPreviewProtocol() {
  protocol.registerFileProtocol('font-preview', async (request, callback) => {
    const [fontPath, fontName] = request.url.replace(`font-preview://`, '').split('::')
    const hash = crypto.createHmac('sha256', 'font').update(request.url).digest('hex')

    const previewFolder = path.join(app.getPath('userData'), 'Lazurite', 'FontPreview')
    if (!existsSync(previewFolder)) fs.mkdir(previewFolder)

    const previewFile = path.join(previewFolder, `${hash}.svg`)
    if (!existsSync(previewFile)) await createFontPreview(fontName, fontPath, previewFile)

    return callback(previewFile)
  })
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
