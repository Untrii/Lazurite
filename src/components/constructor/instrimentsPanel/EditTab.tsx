//import './EditTab.scss'
import { h, JSX } from 'preact'
import { raw as store } from '@/store'
import PositionEditor from './editors/PositionEditor'

const EditTab = () => {
  const editors: JSX.Element[] = []
  editors.push(<PositionEditor />)

  return <div class="edit-tab">{editors}</div>
}
export default EditTab
