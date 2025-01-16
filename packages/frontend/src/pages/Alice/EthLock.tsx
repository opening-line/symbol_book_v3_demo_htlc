import React from "react"
import Offer from "../../component/Offer.tsx"

export const AliceEthLock: React.FC = () => {
  return (
    <>
      <h1>
        アリス <small>ETHのロック</small>
      </h1>
      <div className='grid'>
        <div>
          <Offer />
        </div>
      </div>
    </>
  )
}
