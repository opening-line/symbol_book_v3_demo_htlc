import React from "react"
import { Link } from "react-router-dom"

const Header: React.FC = () => {
  return (
    <header
      style={{
        backgroundColor: "#282c34",
        padding: "0 10px",
        display: "flex",
        gap: "2rem",
        alignItems: "center",
        height: "3.5rem",
      }}
    >
      <div style={{ color: "white", fontSize: "1.5rem" }}>
        <Link to='/'>クロスチェーンスワップアプリ</Link>
      </div>
      <nav>
        <ul
          style={{
            listStyleType: "none",
            display: "flex",
            gap: "15px",
            margin: 0,
            padding: 0,
          }}
        ></ul>
      </nav>
    </header>
  )
}

export default Header
