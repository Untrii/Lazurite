const chokidar = require('chokidar')
const debounce = require('lodash.debounce')
const electron = require('electron')
const path = require('path')
const { exec, spawn } = require('child_process')

async function startRenderer() {
  let proc = exec('npm run devserver')
  proc.stdout.pipe(process.stdout)
  proc.stderr.pipe(process.stderr)
}

let manualRestart = false
let electronProcess = null
function startElectron() {
  var args = [path.join(__dirname, '../src-main/index.dev.js'), '--remote-debugging-port=9222']

  electronProcess = spawn(electron, args)

  electronProcess.stdout.pipe(process.stdout)
  electronProcess.stderr.pipe(process.stderr)

  electronProcess.on('close', () => {
    if (!manualRestart) {
      process.exit()
    }
  })
}

function stopElectron() {
  if (electronProcess) {
    process.kill(electronProcess.pid)
    electronProcess = null
  }
}

function restartElectron() {
  manualRestart = true

  stopElectron()
  startElectron()

  setTimeout(() => {
    manualRestart = false
  }, 5e3)
}

;(async function serve() {
  await startRenderer()

  startElectron()
  //, path.resolve(__dirname, '../src')
  const watcher = chokidar.watch([path.resolve(__dirname, '../src-main')], {
    ignoreInitial: true,
  })
  watcher.on('all', debounce(restartElectron, 500))
})()
