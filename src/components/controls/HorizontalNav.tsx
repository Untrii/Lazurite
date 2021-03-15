import './HorizontalNav.scss'
import { h } from 'preact'

interface IHorizontalNavProps {
  prepend?: string
  items: string[]
  selectedItemIndex?: number
  onChange?: (newIndex: number) => void
  className?: string
}

const HorizontalNav = (props: IHorizontalNavProps) => {
  const renderItem = function (item: string, index: number) {
    const itemClasses = ['horizontal-nav__item']
    if (index === props.selectedItemIndex) itemClasses.push('horizontal-nav__item_selected')
    return (
      <div class={itemClasses.join(' ')} onClick={() => props?.onChange(index)}>
        {item}
      </div>
    )
  }

  const navClasses = 'horizontal-nav' + (` ${props.className}` || '')

  return (
    <div class={navClasses}>
      {props.prepend ? <div class="horizontal-nav__prepend">{props.prepend}</div> : null}
      {props.items.map((item, index) => renderItem(item, index))}
    </div>
  )
}
export default HorizontalNav
