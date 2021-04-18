import './StartScreen.scss'

import { h } from 'preact'
import { useEffect } from 'preact/hooks'

import store from '@/store'
import { PresentationFile } from '@/models/store/AppStateModel'
import useForceUpdate from '@/util/hooks/useForceUpdate'

import Button from '../controls/Button'
import { useReactiveState } from '@/util/reactivity'
import CreateDialog from './CreateDialog'

type ButtonsState =
  | 'mainAppearing'
  | 'main'
  | 'mainHiding'
  | 'createDialogAppearing'
  | 'createDialog'
  | 'createDialogHiding'

const measures = [1e3, 6e4, 36e5, 864e5, 6048e5, 18144e6, 662256e7]
const measureNames = ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years']
const [second, minute, hour, day, week, month, year] = measures

function formatElapsedTime(date: Date) {
  const elapsedTime = new Date().getTime() - date.getTime()
  let measureIndex = 0
  while (measureIndex + 1 < measures.length && elapsedTime > measures[measureIndex + 1]) measureIndex++
  return `${Math.floor(elapsedTime / measures[measureIndex])} ${measureNames[measureIndex]}`
}

const StartScreen = () => {
  const forceUpdate = useForceUpdate()
  const state = useReactiveState({
    buttonsState: 'main' as ButtonsState,
  })

  useEffect(() => {
    setTimeout(() => forceUpdate(), 1000)
  })

  const openCreateDialog = function () {
    state.buttonsState = 'mainHiding'
    setTimeout(() => {
      state.buttonsState = 'createDialogAppearing'
    }, 125)
    setTimeout(() => {
      state.buttonsState = 'createDialog'
    }, 250)
  }

  const openMain = function () {
    state.buttonsState = 'createDialogHiding'
    setTimeout(() => {
      state.buttonsState = 'mainAppearing'
    }, 125)
    setTimeout(() => {
      state.buttonsState = 'main'
    }, 250)
  }

  const openPresentation = function (file: PresentationFile) {
    store.openPresentation(file)
  }

  const buttons = [
    {
      name: 'Create',
      onCLick: openCreateDialog,
    },
    {
      name: 'Open',
    },
    {
      name: 'Import',
    },
  ]

  const rootStyles = store.recentPresentations.length == 0 ? { justifyContent: 'space-around' } : {}
  const buttonsClasses = ['start-screen__right-block']

  if (state.buttonsState.includes('Hiding')) buttonsClasses.push('start-screen__right-block_hiding')
  if (state.buttonsState.includes('Appearing')) buttonsClasses.push('start-screen__right-block_appearing')

  return (
    <div class="start-screen">
      <div class="start-screen__content" style={rootStyles}>
        {store.recentPresentations.length > 0 ? (
          <div class="start-screen__recent">
            <div class="start-screen__recent-header">Recent:</div>
            <div class="start-screen__recent-cards">
              {store.recentPresentations.map((file) => (
                <div class="start-screen__recent-card" onClick={() => openPresentation(file)}>
                  <div class="start-screen__recent-image"></div>
                  <div class="start-screen__recent-description">
                    <div class="start-screen__recent-name">{file.presentation.name}</div>
                    <div class="start-screen__recent-author">by {file.presentation.author}</div>
                    <div class="start-screen__recent-date">
                      last edited: {formatElapsedTime(file.presentation.lastEditDate)} ago
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div class={buttonsClasses.join(' ')}>
          {state.buttonsState.startsWith('main')
            ? buttons.map((button, index) => (
                <Button
                  colorName="blue-500"
                  text={button.name}
                  size="large"
                  blockLevel
                  centred
                  className="start-screen__button"
                  onClick={button.onCLick}
                  key={index}
                />
              ))
            : null}
          {state.buttonsState.startsWith('create') ? <CreateDialog onCancel={openMain} /> : null}
        </div>
      </div>
    </div>
  )
}
export default StartScreen
