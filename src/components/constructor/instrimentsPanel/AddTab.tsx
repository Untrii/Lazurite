import './AddTab.scss'

import { h, JSX } from 'preact'
import { useState } from 'preact/hooks'

import store from '@/store'
import Button from '@/components/controls/Button'
import { isAnySlideExists } from '@/store/getters/reactive/constructor'
import { setTool } from '@/store/actions/constructor'
import { getToolGroups } from '@/store/getters/reactive/tools'

const AddTab = () => {
  const buttonGroups = getToolGroups()
  const [selectedGroupIndex, selectedItemIndex] = store.currentTab.addTabToolIndex

  const changeTabTool = function (groupIndex: number, itemIndex: number) {
    setTool([groupIndex, itemIndex], buttonGroups[groupIndex].items[itemIndex].tool)
  }

  useState(() => {
    changeTabTool(0, 0)
  })

  return (
    <div class="add-tab">
      {isAnySlideExists() ? (
        buttonGroups.map((group, groupIndex) => (
          <div class="add-tab__group">
            {group.displayName ? <h3 class="add-tab__group-title">{group.displayName}</h3> : null}
            {group.items.map((item, itemIndex) => (
              <div class="add-tab__group-button">
                <Button
                  text={item.displayName}
                  icon={item.icon}
                  iconScale={item.iconScale}
                  size="large"
                  blockLevel
                  pressed={selectedGroupIndex == groupIndex && selectedItemIndex == itemIndex}
                  onClick={() => changeTabTool(groupIndex, itemIndex)}
                />
              </div>
            ))}
          </div>
        ))
      ) : (
        <div class="add-tab__empty">Please, create slide</div>
      )}
    </div>
  )
}
export default AddTab
