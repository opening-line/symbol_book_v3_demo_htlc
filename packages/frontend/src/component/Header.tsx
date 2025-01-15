import React from "react"

const Header: React.FC = () => {
  return (
    <header
      style={{
        backgroundColor: "#282c34",
        padding: "10px",
        color: "white",
        display: "flex",
        gap: "2rem",
        alignItems: "center",
      }}
    >
      <div style={{ color: "white", fontSize: "1.5rem" }}>
        クロスチェーンスワップアプリ
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
        >
          <li>
            <a href='#' style={{ color: "white", textDecoration: "none" }}>
              Alice
            </a>
          </li>
          <li>
            <a href='#' style={{ color: "white", textDecoration: "none" }}>
              Bob
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
