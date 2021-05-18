import { useEffect } from 'preact/hooks'

interface IHotkeyOptions {
  keys: string[]
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
}

export let isPressed = {
  shift: false,
  ctrl: false,
  alt: false,
}

const listeners = new Map<string, Set<[IHotkeyOptions, Function]>>()
const pressedButtons = new Set<string>()

function getKey(event: KeyboardEvent) {
  let result
  if (event.key == 'Control' || event.key == 'Shift' || event.key == 'Alt') result = event.key
  else if (event.code.startsWith('Digit') || event.code.startsWith('Numpad'))
    result = event.code.replace('Digit', '').replace('Numpad', '')
  else if (event.code.startsWith('Key')) result = event.code.replace('Key', '')
  else result = event.code

  return result.toLowerCase()
}

function onKeyDown(event: KeyboardEvent) {
  pressedButtons.add(getKey(event))

  switch (event.key) {
    case 'Control':
      isPressed.ctrl = true
      break
    case 'Shift':
      isPressed.shift = true
      break
    case 'Alt':
      isPressed.alt = true
      break
  }

  if (listeners.has(event.code)) {
    listeners.get(event.code).forEach(([options, callback]) => {
      if (options.alt && !isPressed.alt) return
      if (options.ctrl && !isPressed.ctrl) return
      if (options.shift && !isPressed.shift) return

      for (const key of options.keys) {
        if (!pressedButtons.has(key)) return
      }
      callback()
    })
  }
}

function onKeyUp(event: KeyboardEvent) {
  pressedButtons.delete(getKey(event))

  if (event.key == 'Control') isPressed.ctrl = false
  if (event.key == 'Shift') isPressed.shift = false
  if (event.key == 'Alt') isPressed.alt = false
}

window.addEventListener('keydown', onKeyDown)
window.addEventListener('keyup', onKeyUp)

function parseOptions(options: string) {
  options = options.toLowerCase()
  const result = {
    keys: [],
    ctrl: false,
    shift: false,
    alt: false,
  }

  const correctKeys: string[] = []
  const aCode = 'a'.charCodeAt(0)
  for (let i = 0; i < 26; i++) {
    correctKeys.push(String.fromCharCode(aCode + i))
  }
  for (let i = 0; i < 10; i++) {
    correctKeys.push(i + '')
  }
  correctKeys.push('shift', 'ctrl', 'alt', 'delete', 'arrowup', 'arrowright', 'arrowdown', 'arrowleft')

  for (const entry of options.split('+')) {
    if (correctKeys.includes(entry)) {
      switch (entry) {
        case 'shift':
        case 'ctrl':
        case 'alt':
          result[entry] = true
          break
        default:
          result.keys.push(entry)
      }
    }
  }
  return result
}

export default function useHotkey(options: IHotkeyOptions | string, callback: Function) {
  if (typeof options === 'string') return useHotkey(parseOptions(options), callback)
  const { keys } = options
  let codes = []

  for (const key of keys) {
    const keyUpper = key.toUpperCase()
    if (key.length == 1 && keyUpper >= 'A' && keyUpper <= 'Z') codes.push('Key' + key)
    if (key.length == 1 && keyUpper >= '0' && keyUpper <= '9') codes.push('Digit' + key, 'Numpad' + key)
    if (key == 'delete') codes.push('Delete')
    if (key == 'arrowup') codes.push('ArrowUp')
    if (key == 'arrowright') codes.push('ArrowRight')
    if (key == 'arrowdown') codes.push('ArrowDown')
    if (key == 'arrowleft') codes.push('ArrowLeft')
  }

  useEffect(() => {
    for (const code of codes) if (!listeners.has(code)) listeners.set(code, new Set())

    const listener: [IHotkeyOptions, Function] = [options, callback]

    for (const code of codes) listeners.get(code).add(listener)
    return () => {
      for (const code of codes) listeners.get(code).delete(listener)
    }
  })
}
