import './VerticalNav.scss'
import { h } from 'preact'

export interface INavItem {
  displayName: string
  icon: string
}

interface IVerticalNavProps {
  items: INavItem[]
  selectedItemIndex?: number
  onChange?: (newIndex: number) => void
}

const VerticalNav = (props: IVerticalNavProps) => {
  const renderItem = function (item: INavItem, index: number) {
    const itemClasses = ['vertical-nav__item']
    if (index === props.selectedItemIndex) itemClasses.push('vertical-nav__item_selected')
    if (index - 1 === props.selectedItemIndex) itemClasses.push('vertical-nav__item_after-selected')
    if (index + 1 === props.selectedItemIndex) itemClasses.push('vertical-nav__item_before-selected')

    return (
      <div class={itemClasses.join(' ')} onClick={() => props?.onChange(index)}>
        <img src={item.icon} alt={item.displayName} />
      </div>
    )
  }

  const emptySpaceStyles = {
    borderTopLeftRadius: props.items.length - 1 === props.selectedItemIndex ? '4px' : 'none',
  }

  return (
    <div class="vertical-nav">
      {props.items.map((item, index) => renderItem(item, index))}
      <div class="vertical-nav__empty-space" style={emptySpaceStyles}></div>
    </div>
  )
}

export default VerticalNav
