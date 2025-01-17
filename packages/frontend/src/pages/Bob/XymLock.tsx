import React from "react"
import OfferXym from "../../component/OfferXym.tsx"

export const BobXymLock: React.FC = () => {
  return (
    <>
      <h1>
        Bob <small>XYMをロック</small>
      </h1>
      <div className='grid'>
        <div>
          <OfferXym />
        </div>
      </div>
    </>
  )
}
