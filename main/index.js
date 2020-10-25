const electron = require('electron')
const { is } = require('electron-util')

const { app, protocol } = electron

function loadRoute(window, route) {
  let url

  if (is.development) {
    url = `http://localhost:8080/`
  } else {
    url = `file:///${app.getAppPath()}/dist/index.html#${route}`
  }

  window.loadURL(url)
}

// Prevent window being garbage collected
let mainWindow

function createMainWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      webviewTag: true,
    },

    frame: false,
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  loadRoute(mainWindow, '')
}

function createSafeFileProtocol(protocolName, placeholderPath) {
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, '')
    try {
      return callback(decodeURIComponent(url))
    } catch (error) {
      return callback(decodeURIComponent(placeholderPath))
    }
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  createMainWindow()
  createSafeFileProtocol('local-img', 'data/null/image.png')
  createSafeFileProtocol('local-font', 'data/null/font.ttf')
})
