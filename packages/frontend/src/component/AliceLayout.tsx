import React from "react"
import Header from "./Header"
import { Outlet } from "react-router"

const AliceLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AliceLayout
