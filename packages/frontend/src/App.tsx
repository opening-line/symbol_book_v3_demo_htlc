import { PayloadProvider } from "./context/Payload"
import GeneratePayload from "./component/GeneratePayload"

export default function () {
  return (
    <>
      <PayloadProvider>
        <GeneratePayload />
      </PayloadProvider>
    </>
  )
}
