import { useState } from "react"

export default function () {
  const [payload, setPayload] = useState("")
  return (
    <>
      <div>
        <div>秘密を生成</div>
        <div>
          <textarea value={payload} disabled></textarea>
          <button
            onClick={() => {
              const raw = new Uint8Array(1024)
              crypto.getRandomValues(raw)
              setPayload(
                Array.from(raw)
                  .map((b) => b.toString(16).padStart(2, "0"))
                  .join(""),
              )
            }}
          >
            生成
          </button>
        </div>
      </div>
    </>
  )
}
