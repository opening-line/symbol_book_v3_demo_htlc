import React from "react"
import Header from "./Header"
import { Outlet } from "react-router"
import BobSideMenu from "./BobSideMenu.tsx"

const BobLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <BobSideMenu />
      <main style={{ marginLeft: 250 }}>
        <Outlet />
      </main>
    </div>
  )
}

export default BobLayout
