//import './ImageDropOverlay.scss'
import { h, JSX } from 'preact'

interface IImageDropOverlayProps {
  children: JSX.Element
}

const ImageDropOverlay = ({ children }: IImageDropOverlayProps) => {
  return <div>{children}</div>
}
export default ImageDropOverlay
