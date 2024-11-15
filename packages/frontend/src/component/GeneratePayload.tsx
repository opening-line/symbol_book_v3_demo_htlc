import { useContext } from "react"
import { PayloadContext } from "../context/Payload"

export default () => {
  const [payload, setPayload] = useContext(PayloadContext)
  return (
    <div>
      <div>秘密を生成</div>
      <div>
        <textarea
          value={Array.from(payload)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")}
          disabled
        ></textarea>
        <button
          onClick={() => {
            const raw = new Uint8Array(1024)
            crypto.getRandomValues(raw)
            setPayload(raw)
          }}
        >
          生成
        </button>
      </div>
    </div>
  )
}
