import React from "react"
import {Link} from "react-router-dom";

export const BobIndex: React.FC = () => {
  return (
    <>
      <h1>Bob</h1>

      <Link className='button' to='/bob/finish'>
        開始する
      </Link>
    </>
  )
}
