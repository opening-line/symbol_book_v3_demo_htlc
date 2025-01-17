import React from "react"
import OfferEthWait from "../../component/OfferEthWait.tsx"

export const BobEthLockWait: React.FC = () => {
  return (
    <>
      <h1>
        Bob <small>アリスのETHロックを待機</small>
      </h1>
      <div className='grid'>
        <div>
          <OfferEthWait />
        </div>
      </div>
    </>
  )
}
