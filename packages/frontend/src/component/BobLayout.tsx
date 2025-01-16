import React from "react"
import Header from "./Header"
import { Outlet } from "react-router"

const BobLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default BobLayout
