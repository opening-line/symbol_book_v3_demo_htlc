import React from "react"
import EIP6963Chooser from "../../component/EIP6963Chooser.tsx"
import SSSChooser from "../../component/SSSChooser.tsx"
import Offer from "../../component/Offer.tsx"
import OfferReceived from "../../component/OfferReceived.tsx"

export const AliceIndex: React.FC = () => {
  return (
    <div>
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
  )
}
