import React from "react"
import UnlockEth from "../../component/UnlockEth.tsx"

export const BobEthUnlock: React.FC = () => {
  return (
    <>
      <h1>
        Bob <small>アリスのETHのロックを解除</small>
      </h1>
      <div className='grid'>
        <div>
          <UnlockEth />
        </div>
      </div>
    </>
  )
}
