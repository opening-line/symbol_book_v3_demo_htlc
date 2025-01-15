import { EIP6963DetailProvider } from "./context/EIP6963Detail"
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
          <main>
            <h1>
              クロスチェーンスワップアプリ
            </h1>
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
          </main>
        </EIP6963DetailProvider>
      </EthersBrowserProviderProvider>
    </>
  )
}
