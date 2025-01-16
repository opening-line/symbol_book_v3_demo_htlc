import React from "react"
import Header from "./Header"
import { Outlet } from "react-router"
import AliceSideMenu from "./AliceSideMenu.tsx"

const AliceLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <AliceSideMenu />
      <main style={{ marginLeft: 250 }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AliceLayout
