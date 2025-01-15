import React from "react"

const Header: React.FC = () => {
  return (
    <header
      style={{ backgroundColor: "#282c34", padding: "10px", color: "white" }}
    >
      <h1>My Website</h1>
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
              Home
            </a>
          </li>
          <li>
            <a href='#' style={{ color: "white", textDecoration: "none" }}>
              About
            </a>
          </li>
          <li>
            <a href='#' style={{ color: "white", textDecoration: "none" }}>
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
