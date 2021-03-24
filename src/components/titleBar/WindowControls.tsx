import './WindowControls.scss'

import { h } from 'preact'
import { remote } from 'electron'

import { useReactiveState } from '@/util/reactivity'

const WindowControls = () => {
  const state = useReactiveState(() => {
    //ToDo: перенести в глобальное состояние
    remote.getCurrentWindow().on('maximize', () => {
      state.isMaximized = true
    })
    remote.getCurrentWindow().on('unmaximize', () => {
      state.isMaximized = false
    })
    return {
      isMaximized: remote.getCurrentWindow().isMaximized(),
    }
  })

  const onClose = function () {
    remote.getCurrentWindow().destroy()
  }

  const onMinMax = function () {
    const currentWindow = remote.getCurrentWindow()
    if (currentWindow.isMaximized()) {
      currentWindow.unmaximize()
    } else {
      currentWindow.maximize()
    }
  }

  const onMinimize = function () {
    remote.getCurrentWindow().minimize()
  }

  if ((process as any).platform == 'win32') {
    return (
      <div class="window-controls">
        <div class="window-control" onClick={onMinimize}>
          <svg width="12" height="12">
            <g id="minimize">
              <line x1="1" y1="5.5" x2="11" y2="5.5" />
            </g>
          </svg>
        </div>
        <div class="window-control" onClick={onMinMax}>
          {state.isMaximized ? (
            <svg width="12" height="12">
              <g id="restore">
                <rect x="1.5" y="3.5" width="7" height="7" />
                <polyline points="3.5,3.5 3.5,1.5 10.5,1.5 10.5,8.5 8.5,8.5" />
              </g>
            </svg>
          ) : (
            <svg width="12" height="12">
              <g id="maximize">
                <rect x="1.5" y="1.5" width="9" height="9" />
              </g>
            </svg>
          )}
        </div>
        <div class="window-control" id="close-control" onClick={onClose}>
          <svg width="12" height="12">
            <g id="close">
              <path d="M1,1 l 10,10 M1,11 l 10,-10" />
            </g>
          </svg>
        </div>
      </div>
    )
  } else alert('Whoops! There is no close/resize etc. buttons for this platform')
}
export default WindowControls
