import { EIP6963DetailProvider } from "./context/EIP6963Detail"
import EIP6963Chooser from "./component/EIP6963Chooser"
import { PayloadProvider } from "./context/Payload"
import GeneratePayload from "./component/GeneratePayload"
import { EthersBrowserProviderProvider } from "./context/EthersBrowserProvider"

export default function () {
  return (
    <>
      <EthersBrowserProviderProvider>
        <EIP6963DetailProvider>
          <EIP6963Chooser />
        </EIP6963DetailProvider>
        <PayloadProvider>
          <GeneratePayload />
        </PayloadProvider>
      </EthersBrowserProviderProvider>
    </>
  )
}
