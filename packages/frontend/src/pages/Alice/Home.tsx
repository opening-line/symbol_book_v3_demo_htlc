import React from "react"
import {Link} from "react-router-dom";

export const AliceIndex: React.FC = () => {
  return (
    <>
      <h1>アリス</h1>

      <Link className='button' to='/alice/setup'>
        開始する
      </Link>
    </>
  )
}
