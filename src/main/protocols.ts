import { app, protocol, ipcMain } from 'electron'
import path from 'path'
import { promises as fs, existsSync } from 'fs'
import crypto from 'crypto'
import createFontPreview from './createFontPreview'

const contexts = {
  user: app.getPath('userData').replaceAll('\\', '/'),
  std: path.join(process.cwd(), 'data').replaceAll('\\', '/'),
  proj: '',
}

function applyContext(source: string) {
  for (const contextName in contexts) {
    source = source.replace('#' + contextName, contexts[contextName])
  }
  return source
}

ipcMain.on('getContext', (event, arg) => {
  event.returnValue = contexts[arg] ?? ''
})

ipcMain.on('setProjectContext', (event, arg) => {
  contexts.proj = arg.replaceAll('\\', '/')
  event.returnValue = ''
})

ipcMain.on('deleteFile', async (event, arg) => {
  const originalPath = arg
  arg = applyContext(arg)
  let result = 'OK'
  try {
    await fs.unlink(arg)
  } catch {
    result = 'error'
  }
  event.reply('deleteFileResult', originalPath, result)
})

export function createSafeFileProtocol(protocolName) {
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const decodedURL = decodeURIComponent(request.url)
    let [url, params] = decodedURL.replace(`${protocolName}://`, '').split('?')
    url = applyContext(url)
    try {
      return callback(url)
    } catch (error) {
      return null
    }
  })
}

export function createFontPreviewProtocol() {
  protocol.registerFileProtocol('font-preview', async (request, callback) => {
    let decodedURL = decodeURIComponent(request.url)
    decodedURL = applyContext(decodedURL)
    const [fontPath, fontName] = decodedURL.replace(`font-preview://`, '').split('::')
    const hash = crypto.createHmac('sha256', 'font').update(request.url).digest('hex')

    const previewFolder = path.join(app.getPath('userData'), 'Lazurite', 'FontPreview')
    if (!existsSync(previewFolder)) fs.mkdir(previewFolder)

    const previewFile = path.join(previewFolder, `${hash}.svg`)
    try {
      if (!existsSync(previewFile)) await createFontPreview(fontName, fontPath, previewFile)
    } catch (msg) {
      console.log(msg)
      console.log({ fontPath, fontName, previewFile })
      return null
    }

    return callback(previewFile)
  })
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
