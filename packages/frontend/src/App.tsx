import { EIP6963DetailProvider } from "./context/EIP6963Detail"
import EIP6963Chooser from "./component/EIP6963Chooser"
import { PayloadProvider } from "./context/Payload"
import GeneratePayload from "./component/GeneratePayload"

export default function () {
  return (
    <>
      <EIP6963DetailProvider>
        <EIP6963Chooser />
      </EIP6963DetailProvider>
      <PayloadProvider>
        <GeneratePayload />
      </PayloadProvider>
    </>
  )
}
