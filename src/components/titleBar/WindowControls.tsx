import './WindowControls.scss'
import { h } from 'preact'
import { useReactiveState } from '@/util/reactivity'

const WindowControls = () => {
  const state = useReactiveState({
    isMaximized: false,
  })

  const onClose = function () {}

  if ((process as any).platform == 'win32') {
    return (
      <div class="window-controls">
        <div class="window-control">
          <svg width="12" height="12">
            <g id="minimize">
              <line x1="1" y1="5.5" x2="11" y2="5.5" />
            </g>
          </svg>
        </div>
        <div class="window-control">
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
        <div class="window-control" id="close-control">
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
