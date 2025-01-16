import React from "react"
import OfferEth from "../../component/OfferEth.tsx"

export const AliceEthLock: React.FC = () => {
  return (
    <>
      <h1>
        アリス <small>ETHのロック</small>
      </h1>
      <div className='grid'>
        <div>
          <OfferEth />
        </div>
      </div>
    </>
  )
}
