import React from "react"
import EIP6963Chooser from "../../component/EIP6963Chooser.tsx"
import SSSChooser from "../../component/SSSChooser.tsx"
import Offer from "../../component/Offer.tsx"
import OfferReceived from "../../component/OfferReceived.tsx"

export const AliceXymLockWait: React.FC = () => {
  return (
    <>
      <h1>アリス</h1>
      <div className='grid'>
        <div>
          <EIP6963Chooser />
        </div>
        <div>
          <SSSChooser />
        </div>
        <div>
          <Offer />
        </div>
        <div>
          <OfferReceived />
        </div>
      </div>
    </>
  )
}
