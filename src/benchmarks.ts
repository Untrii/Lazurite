export default function init() {
  const win: any = window
  win.benchmarks = {
    windowDataUpdate() {
      const startTime = new Date()
      for (let i = 0; i < 1000; i++) win.__repoInstance.onChange()
      console.log('1000 updates has completed in ' + (new Date().getTime() - startTime.getTime()) + 'ms')
    },
    proxyReactivity() {
      let startTime = new Date()
      let a
      for (let i = 0; i < 1000000; i++) a = win.reactTest.syncronizedObject.a.a.a
      console.log('1 000 000 get operation completed in ' + (new Date().getTime() - startTime.getTime()) + 'ms')
      startTime = new Date()
      for (let i = 0; i < 1000000; i++) a = win.reactTest.syncronizedObject.a.a.a.first = i
      console.log('1 000 000 set operation completed in ' + (new Date().getTime() - startTime.getTime()) + 'ms')
    },
  }
}
