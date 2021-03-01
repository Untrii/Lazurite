import './VerticalNav.scss'
import { h } from 'preact'

interface INavItem {
  name: string
  icon: string
}

interface VerticalNavProps {
  items: INavItem[]
  selectedItemIndex?: number
  onSelected?: (newIndex: number) => void
}

const VerticalNav = (props: VerticalNavProps) => {
  const renderItem = function (item: INavItem, index: number) {
    const itemClasses = ['vertical-nav__item']
    if (index - 1 === props.selectedItemIndex) itemClasses.push('vertical-nav__item_after-selected')
    if (index + 1 === props.selectedItemIndex) itemClasses.push('vertical-nav__item_before-selected')

    return (
      <div class={itemClasses.join(' ')} onClick={() => props.onSelected(index)}>
        <img src={item.icon} alt={item.name} />
      </div>
    )
  }

  return <div class="vertical-nav">{props.items.map((item, index) => renderItem(item, index))}</div>
}

export default VerticalNav
