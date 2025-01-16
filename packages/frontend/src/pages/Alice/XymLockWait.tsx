import React from "react"
import OfferXymWait from "../../component/OfferXymWait.tsx"

export const AliceXymLockWait: React.FC = () => {
  return (
    <>
      <h1>
        アリス <small>ボブのXYMロック待機</small>
      </h1>
      <div className='grid'>
        <div>
          <OfferXymWait />
        </div>
      </div>
    </>
  )
}
