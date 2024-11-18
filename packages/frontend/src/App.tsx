import { EIP6963DetailProvider } from "./context/EIP6963Detail"
import EIP6963Chooser from "./component/EIP6963Chooser"
import { PayloadProvider } from "./context/Payload"
import GeneratePayload from "./component/GeneratePayload"
import { EthersBrowserProviderProvider } from "./context/EthersBrowserProvider"
import DeployHTLC from "./component/DeployHTLC"
import SecretLock from "./component/SecretLock"
import SecretProof from "./component/SecretProof"

export default function () {
  return (
    <>
      <EthersBrowserProviderProvider>
        <EIP6963DetailProvider>
          <PayloadProvider>
            <EIP6963Chooser />
            <hr />
            <GeneratePayload />
            <hr />
            <DeployHTLC />
            <hr />
            <SecretLock />
            <hr />
            <SecretProof />
            <hr />
          </PayloadProvider>
        </EIP6963DetailProvider>
      </EthersBrowserProviderProvider>
    </>
  )
}
