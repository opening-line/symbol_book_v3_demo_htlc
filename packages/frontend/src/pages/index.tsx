import React from "react"
import { Link } from "react-router-dom"

export const Home: React.FC = () => {
  return (
    <div>
      <h1>クロスチェーンスワップアプリ</h1>
      <div style={{ marginBottom: "3rem" }}>
        <Link className='button' style={{ marginRight: ".4rem"}} to="/alice">アリスとして開始</Link>
        <p>
          スワップの開始者です。①ETHのロックを行います。②ボブのXYMのロックを待ちます。③XYMのロックを解除します。
        </p>
      </div>
      <div>
        <Link className='button' style={{ marginRight: ".4rem" }} to="/bob">ボブとして開始</Link>
        <p>
          スワップの相手方です。①アリスのETHのロックを待ちます。②XYMをロックします。③アリスのXYMのロックを待ちます。④ETHのロックを解除します。
        </p>
      </div>
    </div>
  )
}
