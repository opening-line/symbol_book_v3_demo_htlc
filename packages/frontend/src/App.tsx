import { EIP6963DetailProvider } from "./context/EIP6963Detail"
import { PayloadProvider } from "./context/Payload"
import { EthersBrowserProviderProvider } from "./context/EthersBrowserProvider"
import EIP6963Chooser from "./component/EIP6963Chooser"
import SSSChooser from "./component/SSSChooser"
import OfferReceived from "./component/OfferReceived"
import Offer from "./component/Offer"

export default function () {
  return (
    <>
      <EthersBrowserProviderProvider>
        <EIP6963DetailProvider>
          <PayloadProvider>
            <h1>クロスチェーンスワップアプリ</h1>
            <hr />
            <EIP6963Chooser />
            <hr />
            <SSSChooser />
            <hr />
            <Offer />
            <hr />
            <OfferReceived />
            <hr />
          </PayloadProvider>
        </EIP6963DetailProvider>
      </EthersBrowserProviderProvider>
    </>
  )
}
