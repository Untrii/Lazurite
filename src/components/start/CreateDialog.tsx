import './CreateDialog.scss'
import { h } from 'preact'
import Button from '../controls/Button'

interface ICreateDialogProps {
  onCancel?: () => void
}

const CreateDialog = ({ onCancel }: ICreateDialogProps) => {
  return (
    <div class="create-dialog">
      <div class="create-dialog__header">New presentation</div>
      <div class="create-dialog__content">Inputs here...</div>
      <div class="create-dialog__bottom-buttons">
        <Button text="Create" className="create-dialog__button" />
        <Button text="Cancel" className="create-dialog__button" onClick={onCancel} />
      </div>
    </div>
  )
}
export default CreateDialog
