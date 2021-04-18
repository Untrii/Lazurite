import './FilePicker.scss'

import { h } from 'preact'
import { useState } from 'preact/hooks'

import AnimatedDialogBox from './AnimatedDialogBox'
import Button from '../controls/Button'

interface IFilePickerProps {
  isHiding: boolean
  extensions?: string[]
  onSelected?: (files: ArrayBuffer[]) => void
}

const FilePicker = ({ isHiding, extensions, onSelected }: IFilePickerProps) => {
  const width = 168
  const height = 282
  const [isHovered, setIsHovered] = useState(false)

  const onDragEnter = function (event: DragEvent) {
    console.log('drag enter')
    setIsHovered(true)
  }

  const onDragLeave = function (event: DragEvent) {
    console.log('drag leave')
    setIsHovered(false)
  }

  const onDragOver = function (event: DragEvent) {
    event.preventDefault()
  }

  const onDrop = async function (event: DragEvent) {
    setIsHovered(false)
    const files = event.dataTransfer.files

    const filesToAdd = [] as ArrayBuffer[]

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      const [name, extension] = file.name.split('.')
      if (extensions && !extensions.includes(extension)) continue
      else filesToAdd.push(await file.arrayBuffer())
    }
    const items = event.dataTransfer.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type == 'text/uri-list') {
        const data = await new Promise<Response>((resolve, reject) => {
          items[i].getAsString((str) => {
            fetch(str).then(resolve).catch(reject)
          })
        })
        const blob = await data.blob()
        if (blob.type.startsWith('image')) filesToAdd.push(await blob.arrayBuffer())
      }
    }
    onSelected?.(filesToAdd)
    console.log(filesToAdd)
  }

  return (
    <AnimatedDialogBox width={width} height={height} isHiding={isHiding}>
      <div class="file-picker">
        <div
          class={'file-picker__dropzone' + (isHovered ? ' file-picker__dropzone_hovered' : '')}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          Drop files here
        </div>
        <div class="file-picker__buttons">
          <Button text="Cancel" />
          <Button text="Browse" />
        </div>
      </div>
    </AnimatedDialogBox>
  )
}
export default FilePicker
