import React, { useMemo } from "react"
import { useLocation } from "react-router-dom"

export type SideMenuItem = {
  to: string
  label: string
}

type Props = {
  menuItems: SideMenuItem[]
}

export const SideMenu: React.FC<Props> = ({ menuItems }) => {
  const location = useLocation()

  const [doneMenuItems, doingMenuItems, toDoMenuItems] = useMemo(() => {
    const pathEqIndex = menuItems.findIndex(
      (item) => item.to === location.pathname,
    )

    if (pathEqIndex === -1) {
      return [[], [], menuItems]
    }

    const doingMenuItem = menuItems[pathEqIndex]

    return [
      menuItems.slice(0, pathEqIndex),
      [doingMenuItem],
      menuItems.slice(pathEqIndex + 1),
    ]
  }, [location])

  return (
    <nav className='side-menu'>
      <ul>
        {doneMenuItems.map((item, index) => (
          <li key={index}>
            <span className='done'>{item.label}</span>
            <span style={{ marginLeft: 5, display: "inline-block" }}>✅</span>
          </li>
        ))}
        {doingMenuItems.map((item, index) => (
          <li key={index}>
            <span className='doing'>{item.label}</span>
            <span style={{ marginLeft: 5, display: "inline-block" }}></span>🟢
          </li>
        ))}
        {toDoMenuItems.map((item, index) => (
          <li key={index}>
            <span className='todo'>{item.label}</span>
            <span style={{ marginLeft: 5, display: "inline-block" }}>⬜</span>
          </li>
        ))}
      </ul>
    </nav>
  )
}
