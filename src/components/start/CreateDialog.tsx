import './CreateDialog.scss'

import { h } from 'preact'
import { useState } from 'preact/hooks'

import * as navigation from '@/store/actions/navigation'

import Button from '../controls/Button'
import TextInput from '../controls/TextInput'

interface ICreateDialogProps {
  onCancel?: () => void
}

const CreateDialog = ({ onCancel }: ICreateDialogProps) => {
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')

  const onCreate = async function () {
    await navigation.createPresentation(name, author)
  }

  return (
    <div class="create-dialog">
      <div class="create-dialog__header">New presentation</div>
      <div class="create-dialog__content">
        <TextInput value={name} prepend="Name:" placeHolder="input here..." onChange={(name) => setName(name)} />
        <div style="margin-top:8px"></div>
        <TextInput
          value={author}
          prepend="Author:"
          placeHolder="input here..."
          onChange={(author) => setAuthor(author)}
        />
      </div>
      <div class="create-dialog__bottom-buttons">
        <Button text="Create" className="create-dialog__button" onClick={onCreate} />

        <Button text="Cancel" className="create-dialog__button" onClick={onCancel} />
      </div>
    </div>
  )
}
export default CreateDialog
